// Notification Service - sends email notifications via Edge Function
// e grava a notificação in-app (tabela oli_notifications, lida pelo sino
// no header) a partir do mesmo ponto único.
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/send-notification-email`;

type NotificationType = 
  | "new_message"
  | "rental_request"
  | "rental_approved"
  | "rental_rejected"
  | "contract_sent"
  | "contract_signed"
  | "pickup_inspection_completed"
  | "dropoff_inspection_completed"
  | "cnh_approved"
  | "cnh_rejected"
  | "vehicle_approved"
  | "vehicle_rejected"
  | "status_update";

interface NotificationPayload {
  type: NotificationType;
  recipient_id: string;
  data: Record<string, unknown>;
}

// Título/texto curto e link de destino para o sino de notificações
// in-app — independente do assunto/corpo HTML do e-mail.
function buildInAppNotification(
  type: NotificationType,
  data: Record<string, unknown>
): { title: string; body: string; link: string } {
  const vehicleTitle = (data.vehicle_title as string) || "veículo";
  switch (type) {
    case "new_message":
      return {
        title: `Nova mensagem de ${data.sender_name || "alguém"}`,
        body: (data.message_preview as string) || "",
        link: "/messages",
      };
    case "rental_request":
      return {
        title: "Nova solicitação de aluguel",
        body: `${data.renter_name || "Um motorista"} quer alugar seu ${vehicleTitle}`,
        link: "/reservations",
      };
    case "rental_approved":
      return {
        title: "Reserva aprovada!",
        body: `Sua reserva do ${vehicleTitle} foi aprovada`,
        link: "/reservations",
      };
    case "rental_rejected":
      return {
        title: "Reserva não aprovada",
        body: `Sua reserva do ${vehicleTitle} não foi aprovada`,
        link: "/reservations",
      };
    case "contract_sent":
      return {
        title: "Contrato disponível para assinatura",
        body: `Contrato do ${vehicleTitle} pronto para assinar`,
        link: "/reservations",
      };
    case "contract_signed":
      return {
        title: "Contrato assinado!",
        body: `${data.renter_name || "O locatário"} assinou o contrato do ${vehicleTitle}`,
        link: "/reservations",
      };
    case "pickup_inspection_completed":
      return {
        title: "Veículo liberado para uso!",
        body: `Retirada do ${vehicleTitle} confirmada`,
        link: "/reservations",
      };
    case "dropoff_inspection_completed":
      return {
        title: "Vistoria de devolução concluída",
        body: `${data.renter_name || "O locatário"} registrou a devolução do ${vehicleTitle}`,
        link: "/reservations",
      };
    case "cnh_approved":
      return {
        title: "CNH aprovada!",
        body: "Sua carteira de motorista foi verificada com sucesso",
        link: "/profile",
      };
    case "cnh_rejected":
      return {
        title: "CNH reprovada",
        body: "Não foi possível verificar sua carteira de motorista",
        link: "/profile/driver-license",
      };
    case "vehicle_approved":
      return {
        title: "Veículo aprovado!",
        body: `${vehicleTitle} já está disponível para aluguel`,
        link: "/my-vehicles",
      };
    case "vehicle_rejected":
      return {
        title: "Veículo não aprovado",
        body: `${vehicleTitle} não passou na verificação`,
        link: "/my-vehicles",
      };
    case "status_update":
      return {
        title: (data.title as string) || "Atualização de status",
        body: (data.body as string) || "Uma pendência ou status foi atualizado na sua conta",
        link: (data.link as string) || "/home",
      };
    default:
      return { title: "Nova notificação", body: "", link: "/home" };
  }
}

async function sendNotification(payload: NotificationPayload): Promise<boolean> {
  // Grava a notificação in-app (não bloqueia nem depende do envio de
  // e-mail — se uma falhar, a outra ainda deve seguir em frente).
  try {
    const { title, body, link } = buildInAppNotification(payload.type, payload.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("oli_notifications").insert({
      user_id: payload.recipient_id,
      type: payload.type,
      title,
      body,
      link,
    });
  } catch (error) {
    console.error("Failed to save in-app notification:", error);
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": session?.access_token ? `Bearer ${session.access_token}` : "",
        "apikey": SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Notification error:", errorText);
      return false;
    }

    const result = await response.json();
    console.log("Notification sent:", result);
    return result.success ?? true;
  } catch (error) {
    console.error("Failed to send notification:", error);
    return false;
  }
}

// ============================================================
// NOTIFICATION HELPERS
// ============================================================

export async function notifyNewMessage(
  recipientId: string,
  senderName: string,
  messagePreview: string
): Promise<boolean> {
  return sendNotification({
    type: "new_message",
    recipient_id: recipientId,
    data: {
      sender_name: senderName,
      message_preview: messagePreview.substring(0, 100),
    },
  });
}

export async function notifyRentalRequest(
  ownerId: string,
  renterName: string,
  vehicleTitle: string,
  startDate: string,
  endDate: string,
  totalPrice: number
): Promise<boolean> {
  return sendNotification({
    type: "rental_request",
    recipient_id: ownerId,
    data: {
      renter_name: renterName,
      vehicle_title: vehicleTitle,
      start_date: startDate,
      end_date: endDate,
      total_price: totalPrice.toFixed(2),
    },
  });
}

export async function notifyRentalApproved(
  renterId: string,
  vehicleTitle: string,
  startDate: string,
  endDate: string
): Promise<boolean> {
  return sendNotification({
    type: "rental_approved",
    recipient_id: renterId,
    data: {
      vehicle_title: vehicleTitle,
      start_date: startDate,
      end_date: endDate,
    },
  });
}

export async function notifyRentalRejected(
  renterId: string,
  vehicleTitle: string,
  startDate: string,
  endDate: string
): Promise<boolean> {
  return sendNotification({
    type: "rental_rejected",
    recipient_id: renterId,
    data: {
      vehicle_title: vehicleTitle,
      start_date: startDate,
      end_date: endDate,
    },
  });
}

export async function notifyContractSent(
  renterId: string,
  vehicleTitle: string,
  contractNumber: string
): Promise<boolean> {
  return sendNotification({
    type: "contract_sent",
    recipient_id: renterId,
    data: {
      vehicle_title: vehicleTitle,
      contract_number: contractNumber,
    },
  });
}

export async function notifyContractSigned(
  ownerId: string,
  renterName: string,
  vehicleTitle: string,
  contractNumber: string
): Promise<boolean> {
  return sendNotification({
    type: "contract_signed",
    recipient_id: ownerId,
    data: {
      renter_name: renterName,
      vehicle_title: vehicleTitle,
      contract_number: contractNumber,
    },
  });
}

export async function notifyPickupInspectionCompleted(
  renterId: string,
  ownerName: string,
  vehicleTitle: string,
  rentalId: string
): Promise<boolean> {
  return sendNotification({
    type: "pickup_inspection_completed",
    recipient_id: renterId,
    data: {
      owner_name: ownerName,
      vehicle_title: vehicleTitle,
      rental_id: rentalId,
    },
  });
}

export async function notifyDropoffInspectionCompleted(
  ownerId: string,
  renterName: string,
  vehicleTitle: string,
  rentalId: string,
  hasDamages: boolean
): Promise<boolean> {
  return sendNotification({
    type: "dropoff_inspection_completed",
    recipient_id: ownerId,
    data: {
      renter_name: renterName,
      vehicle_title: vehicleTitle,
      rental_id: rentalId,
      has_damages: hasDamages,
    },
  });
}

export async function notifyVehicleApproved(
  ownerId: string,
  vehicleTitle: string,
  statusLabel?: string
): Promise<boolean> {
  return sendNotification({
    type: "vehicle_approved",
    recipient_id: ownerId,
    data: {
      vehicle_title: vehicleTitle,
      status_label: statusLabel || "APROVADO",
    },
  });
}

export async function notifyVehicleRejected(
  ownerId: string,
  vehicleTitle: string,
  statusLabel?: string
): Promise<boolean> {
  return sendNotification({
    type: "vehicle_rejected",
    recipient_id: ownerId,
    data: {
      vehicle_title: vehicleTitle,
      status_label: statusLabel || "REPROVADO",
    },
  });
}

export async function notifyStatusUpdate(
  recipientId: string,
  title: string,
  body: string,
  link = "/home",
  extraData: Record<string, unknown> = {}
): Promise<boolean> {
  return sendNotification({
    type: "status_update",
    recipient_id: recipientId,
    data: {
      ...extraData,
      title,
      body,
      link,
    },
  });
}

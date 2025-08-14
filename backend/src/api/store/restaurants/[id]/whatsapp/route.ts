import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const restaurantId = req.params.id;

  const restaurantQuery = {
    entity: "restaurant",
    fields: [
      "id",
      "name", // Optional if you want to identify it in the UI
      "whatsapp_webhook_url",
      "whatsapp_token",
      "whatsapp_phone_number_id"
    ],
    filters: {
      id: restaurantId,
    },
  };

  const {
    data: [restaurant],
  } = await query.graph(restaurantQuery);

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  return res.status(200).json({ restaurant });
}

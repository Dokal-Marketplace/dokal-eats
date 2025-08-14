import { model } from "@medusajs/utils";
import { RestaurantAdmin } from "./restaurant-admin";

export const Restaurant = model.define("restaurant", {
  id: model
    .id({
      prefix: "res",
    })
    .primaryKey(),
  handle: model.text(),
  is_open: model.boolean().default(false),
  name: model.text(),
  description: model.text().nullable(),
  phone: model.text(),
  email: model.text(),
  address: model.text(),
  image_url: model.text().nullable(),
  admins: model.hasMany(() => RestaurantAdmin),
  whatsapp_webhook_url: model.text().nullable(), // WhatsApp webhook callback URL (if per-tenant)
  whatsapp_token: model.text().nullable(), // SENSITIVE: WhatsApp Business API access token — do NOT expose via API or logs
  whatsapp_phone_number_id: model.text().nullable(), // WhatsApp phone number ID
});

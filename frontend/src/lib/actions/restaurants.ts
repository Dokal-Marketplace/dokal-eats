"use server";

import {retrieveSession} from "@frontend/lib/data/sessions";
import {RestaurantDTO, RestaurantProductDTO} from "@frontend/lib/types";
import {promises as fs} from "fs";
import {revalidatePath, revalidateTag} from "next/cache";
import {sdk} from "../config";
import {getAuthHeaders, getCacheTag} from "../data/cookies";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:9000";
const FRONTEND_URL =
  (process.env.NEXT_PUBLIC_VERCEL_URL &&
    `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`) ||
  "http://localhost:3000";

export async function setRestaurantStatus(
  restaurantId: string,
  status: boolean
): Promise<RestaurantDTO | {message: string}> {
  try {
    const {restaurant} = await sdk.client.fetch<{
      restaurant: RestaurantDTO;
    }>(`/restaurants/${restaurantId}/status`, {
      method: "POST",
      body: {is_open: status},
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeaders())
      }
    });

    revalidateTag(await getCacheTag("restaurants"));

    return restaurant;
  } catch (error) {
    return {message: "Error setting restaurant status"};
  }
}

export async function createProduct(
  prevState: any,
  createProductData: FormData
): Promise<RestaurantProductDTO | {message: string}> {
  const token = retrieveSession();
  const restaurantId = createProductData.get("restaurant_id") as string;
  const image = createProductData.get("image") as File;
  const fileName = image?.name;

  if (image) {
    await saveFile(image, fileName as string);
  }

  createProductData.set("thumbnail", `${FRONTEND_URL}/${fileName}`);

  createProductData.delete("image");

  const productData = {} as Record<string, any>;

  Array.from(createProductData.entries()).forEach(([key, value]) => {
    if (key === "restaurant_id") {
      return;
    }
    productData[key] = value;
  });

  try {
    const {restaurant_product} = await sdk.client.fetch<{
      restaurant_product: RestaurantProductDTO;
    }>(`/restaurants/${restaurantId}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeaders())
      },
      body: productData
    });

    revalidateTag(await getCacheTag("products"));

    return restaurant_product;
  } catch (error) {
    return {message: "Error creating product"};
  }
}

async function saveFile(file: File, fileName: string) {
  const data = await file.arrayBuffer();
  await fs.appendFile(`./public/${fileName}`, Buffer.from(data));
  return;
}

export async function deleteProduct(productId: string, restaurantId: string) {
  try {
    await sdk.client.fetch(`/restaurants/${restaurantId}/products`, {
      method: "DELETE",
      body: {product_ids: [productId]},
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeaders())
      }
    });

    revalidateTag(await getCacheTag("products"));
    revalidateTag(await getCacheTag("restaurants"));

    return true;
  } catch (error) {
    return false;
  }
}
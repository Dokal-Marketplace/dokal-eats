"use client";

import { createProduct } from "@frontend/lib/actions";
import { RestaurantDTO } from "@frontend/lib/types";
import { HttpTypes } from "@medusajs/types";
import { Input, Label, Select, Textarea } from "@medusajs/ui";
import { useActionState } from "react";

export function CreateProductForm({
  restaurant,
  categories,
}: {
  restaurant: RestaurantDTO;
  categories: HttpTypes.StoreProductCategory[];
}) {
  const [state, formAction] = useActionState(createProduct, null);
  return (
    <form
      className="flex flex-col gap-3"
      name="create-product"
      id="create-product"
      action={formAction}
    >
      <input type="hidden" name="restaurant_id" value={restaurant.id} />
      <Input placeholder="Title" name="title" />
      <Textarea placeholder="Description" name="description" />
      <Select name="category_id">
        <Select.Trigger>
          <Select.Value placeholder="Select a category" />
        </Select.Trigger>
        <Select.Content className="z-[50]">
          {categories?.map((category) => (
            <Select.Item key={category.id} value={category.id}>
              {category.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
      <Input placeholder="Price" name="price" type="number" />
      <Label htmlFor="image">Upload image:</Label>
      <Input
        className="p-2 h-fit"
        type="file"
        name="image"
        id="image"
        accept="image/png, image/jpeg, image/jpg"
      />
    </form>
  );
}

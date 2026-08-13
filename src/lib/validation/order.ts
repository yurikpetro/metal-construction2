import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().nullable(),
  quantity: z.number().int().min(1).max(999),
});

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Введите имя")
    .max(120, "Слишком длинное имя"),
  phone: z
    .string()
    .trim()
    .min(10, "Введите номер телефона")
    .refine((v) => v.replace(/\D/g, "").length >= 10, {
      message: "Введите корректный номер телефона",
    }),
  address: z
    .string()
    .trim()
    .min(5, "Введите адрес доставки")
    .max(300, "Слишком длинный адрес"),
  comment: z.string().trim().max(1000).optional().or(z.literal("")),
  consent: z
    .boolean()
    .refine((v) => v === true, {
      error: "Нужно согласие на обработку персональных данных",
    }),
  items: z.array(cartItemSchema).min(1, "Корзина пуста"),
  // honeypot — обычный пользователь это поле не увидит и не заполнит
  website: z.string().max(0).optional().or(z.literal("")),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

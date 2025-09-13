export const formatVietnameseCurrency = amount => {
  if (!amount) return "0VNĐ";
  return amount
    .toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    })
    .replace("₫", "VNĐ");
};
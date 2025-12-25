import { Service, ServiceCategory, Skill } from "./types";

export const MOCK_SKILLS: Skill[] = [
  { id: "s1", name: "Facial", code: "FACIAL" },
  { id: "s2", name: "Massage Body", code: "BODY" },
  { id: "s3", name: "Nặn mụn", code: "ACNE" },
  { id: "s4", name: "Gội đầu", code: "SHAMPOO" },
  { id: "s5", name: "Massage Cổ Vai Gáy", code: "NECK" },
  { id: "s6", name: "Laser", code: "LASER" },
  { id: "s7", name: "Tắm trắng", code: "WHITENING" },
  { id: "s8", name: "Peel da", code: "PEEL" },
  { id: "s9", name: "Triệt lông", code: "HAIR_REMOVAL" },
];

export const MOCK_CATEGORIES: ServiceCategory[] = [
  { id: "cat_massage", name: "Massage", sort_order: 0 },
  { id: "cat_facial", name: "Facial", sort_order: 1 },
  { id: "cat_hair", name: "Hair Care", sort_order: 2 },
  { id: "cat_sauna", name: "Sauna", sort_order: 3 },
  { id: "cat_package", name: "Package", sort_order: 4 },
];

export const MOCK_SERVICES: Service[] = [
  {
    id: "svc_01",
    name: "Trị liệu Thư giãn Toàn thân",
    description:
      "Liệu pháp massage chuyên sâu giúp giải tỏa căng thẳng, cải thiện tuần hoàn máu và mang lại giấc ngủ ngon.",
    duration: 60,
    buffer_time: 15,
    price: 590000,
    category_id: "cat_massage",
    image_url:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1000",
    color: "#3b82f6",
    is_active: true,
    is_popular: true,
    skills: [MOCK_SKILLS[1]],
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "svc_02",
    name: "Chăm sóc Da mặt Chuyên sâu",
    description:
      "Quy trình 12 bước với tinh chất collagen giúp tái tạo làn da, mờ nếp nhăn và sáng mịn tự nhiên.",
    duration: 90,
    buffer_time: 20,
    price: 1200000,
    category_id: "cat_facial",
    image_url:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1000",
    color: "#ef4444",
    is_active: true,
    is_popular: true,
    skills: [MOCK_SKILLS[0], MOCK_SKILLS[2]],
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "svc_03",
    name: "Gội đầu Dưỡng sinh Đông y",
    description:
      "Kết hợp massage cổ vai gáy và thảo dược thiên nhiên, giúp giảm đau đầu và thư giãn tuyệt đối.",
    duration: 45,
    buffer_time: 10,
    price: 250000,
    category_id: "cat_hair",
    image_url:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=1000",
    color: "#10b981",
    is_active: true,
    skills: [MOCK_SKILLS[3], MOCK_SKILLS[4]],
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "svc_04",
    name: "Xông hơi Đá muối Himalaya",
    description:
      "Thanh lọc cơ thể, đào thải độc tố và tăng cường hệ miễn dịch với khu vực xông đá muối nhập khẩu.",
    duration: 30,
    buffer_time: 15,
    price: 150000,
    category_id: "cat_sauna",
    image_url:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000",
    color: "#f59e0b",
    is_active: true,
    skills: [],
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "svc_05",
    name: "Massage Chân Bấm huyệt",
    description:
      "Kích thích các huyệt đạo bàn chân giúp đả thông kinh mạch và cải thiện sức khỏe nội tạng.",
    duration: 45,
    buffer_time: 10,
    price: 350000,
    category_id: "cat_massage",
    image_url:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=1000",
    color: "#8b5cf6",
    is_active: true,
    skills: [MOCK_SKILLS[1]],
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "svc_06",
    name: "Combo Thư giãn Thượng hạng",
    description:
      "Kết hợp Massage Body, Facial và Xông hơi. Trải nghiệm trọn vẹn sự thư thái đỉnh cao.",
    duration: 150,
    buffer_time: 30,
    price: 2500000,
    category_id: "cat_package",
    image_url:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=1000",
    color: "#ec4899",
    is_active: true,
    is_popular: true,
    skills: [MOCK_SKILLS[0], MOCK_SKILLS[1]],
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
];

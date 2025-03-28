export enum BookFacultyType {
  FME = 'FME',
  DEE = 'DEE',
  FCE = 'FCE',
  FChE = 'FChE',
  CSE = 'CSE',
  GEOPET = 'GEOPET',
  FAS = 'FAS',
  FMT = 'FMT',
  FTE = 'FTE',
  SIM = 'SIM',
  FENR = 'FENR',
  IMTC = 'IMTC',
  PFIEV = 'PFIEV',
  GE = 'GE',
  PLTC = 'PLTC',
}

export const BOOK_FACULTY_OPTIONS = [
  {
    value: BookFacultyType.GE,
    label: 'Đại cương',
  },
  {
    value: BookFacultyType.FME,
    label: 'Khoa Cơ khí',
  },
  {
    value: BookFacultyType.DEE,
    label: 'Khoa Điện - Điện tử',
  },
  {
    value: BookFacultyType.FCE,
    label: 'Khoa Kỹ thuật Xây dựng',
  },
  {
    value: BookFacultyType.FChE,
    label: 'Khoa Kỹ thuật Hóa học',
  },
  {
    value: BookFacultyType.CSE,
    label: 'Khoa Khoa học và Kỹ thuật Máy tính',
  },
  {
    value: BookFacultyType.GEOPET,
    label: 'Khoa Kỹ thuật Địa chất và Dầu khí',
  },
  {
    value: BookFacultyType.FAS,
    label: 'Khoa Khoa học Ứng dụng',
  },
  {
    value: BookFacultyType.FMT,
    label: 'Khoa Công nghệ Vật liệu',
  },
  {
    value: BookFacultyType.FTE,
    label: 'Khoa Kỹ thuật Giao thông',
  },
  {
    value: BookFacultyType.SIM,
    label: 'Khoa Quản lý Công nghiệp',
  },
  {
    value: BookFacultyType.FENR,
    label: 'Khoa Khoa học Môi trường và Tài nguyên',
  },
  {
    value: BookFacultyType.PLTC,
    label: 'Lý luận chính trị',
  },
];

export const FACULTY_TO_NAME_MAP = Object.fromEntries(
  BOOK_FACULTY_OPTIONS.map((facultyOption) => [facultyOption.value, facultyOption.label])
);

export type Book = {
  year: number;
  bookId: string;
  title: string;
  faculty: BookFacultyType;
  thumbnail: string;
  totalAmount: number;
  receivedAmount: number;
  createdAt: string;
  updatedAt: string;
};

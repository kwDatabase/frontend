export const PRODUCTS = [
    {
        id: 1,
        name: "중고 자전거",
        price: 50000,
        image: "https://via.placeholder.com/150",
        seller: "홍길동",
        rating: 4.5, // 판매자 평점
        popularity: 10,
        recentDate: new Date(2023, 1, 1),
        discount: 0,
        stock: 5,
        reviews: [
            {
                reviewer: "김영희",
                content: "자전거 상태가 매우 좋습니다! 추천합니다.",
                date: new Date(2023, 1, 15),
                rating: 4.5, // 별점 기능
            },
            {
                reviewer: "이철수",
                content: "가격이 저렴하고 만족스럽습니다.",
                date: new Date(2023, 2, 5),
                rating: 5.0, // 별점 추가
            },
        ],
        inquiries: [ // 문의 정보 추가
            {
                asker: "최민수",
                content: "자전거의 배터리 상태는 어떤가요?",
                date: new Date(2023, 1, 20),
            },
            {
                asker: "이서준",
                content: "배송은 얼마나 걸리나요?",
                date: new Date(2023, 2, 1),
            },
        ],
    },
    {
        id: 2,
        name: "중고 책",
        price: 10000,
        image: "https://via.placeholder.com/150",
        seller: "김철수",
        rating: 3.8, // 판매자 평점
        popularity: 20,
        recentDate: new Date(2023, 5, 1),
        discount: 10,
        stock: 15,
        reviews: [
            {
                reviewer: "박지민",
                content: "책 상태가 괜찮아요. 감사합니다.",
                date: new Date(2023, 5, 10),
                rating: 4.0, // 별점 기능
            },
        ],
        inquiries: [ // 문의 정보 추가
            {
                asker: "유진",
                content: "책의 페이지 수는 얼마인가요?",
                date: new Date(2023, 5, 12),
            },
            {
                asker: "민서",
                content: "책을 반품할 수 있나요?",
                date: new Date(2023, 5, 15),
            },
        ],
    },
    {
        id: 3,
        name: "중고 노트북",
        price: 300000,
        image: "https://via.placeholder.com/150",
        seller: "이영희",
        rating: 4.0, // 판매자 평점
        popularity: 5,
        recentDate: new Date(2023, 3, 1),
        discount: 5,
        stock: 3,
        reviews: [],
        inquiries: [ // 문의 정보 추가
            {
                asker: "정우",
                content: "노트북의 배터리 수명은 어떻게 되나요?",
                date: new Date(2023, 3, 5),
            },
        ],
    },
    {
        id: 4,
        name: "중고 핸드폰",
        price: 200000,
        image: "https://via.placeholder.com/150",
        seller: "박민수",
        rating: 4.7, // 판매자 평점
        popularity: 15,
        recentDate: new Date(2023, 6, 1),
        discount: 20,
        stock: 10,
        reviews: [],
        inquiries: [ // 문의 정보 추가
            {
                asker: "수빈",
                content: "핸드폰의 스크래치 상태는 어떤가요?",
                date: new Date(2023, 6, 2),
            },
        ],
    },
    {
        id: 5,
        name: "아이폰 16 pro",
        price: 1000000,
        image: "https://via.placeholder.com/150",
        seller: "박만수",
        rating: 2.7, // 판매자 평점
        popularity: 15,
        recentDate: new Date(2023, 6, 1),
        discount: 0,
        stock: 1,
        reviews: [],
        inquiries: [ // 문의 정보 추가
            {
                asker: "하늘",
                content: "이 모델의 색상은 무엇이 있나요?",
                date: new Date(2023, 6, 3),
            },
        ],
    }, 
    {
        id: 6,
        name: "갤럭시 222",
        price: 1000000,
        image: "https://via.placeholder.com/150",
        seller: "억수수",
        rating: 4.6, // 판매자 평점
        popularity: 15,
        recentDate: new Date(2023, 6, 1),
        discount: 0,
        stock: 1,
        reviews: [],
        inquiries: [ // 문의 정보 추가
            {
                asker: "지민",
                content: "갤럭시 222의 메모리 용량은 얼마인가요?",
                date: new Date(2023, 6, 4),
            },
        ],
    }
];
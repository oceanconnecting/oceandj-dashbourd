import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async () => {
  try {
    const ordersPerMonth = await db.order.groupBy({
      by: ['createdAt'],
      _count: {
        id: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const monthlyOrderCountMap = new Map();

    ordersPerMonth.forEach(order => {
      const month = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`;
      const count = order._count.id;

      if (monthlyOrderCountMap.has(month)) {
        monthlyOrderCountMap.set(month, monthlyOrderCountMap.get(month) + count);
      } else {
        monthlyOrderCountMap.set(month, count);
      }
    });

    const monthlyOrderCount = Array.from(monthlyOrderCountMap.entries()).map(([month, totalOrders]) => ({
      month,
      totalOrders,
    }));

    return NextResponse.json({
      success: true,
      monthlyOrderCount,
    });
  } catch (error) {
    console.error('Error fetching monthly orders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch monthly orders' },
      { status: 500 }
    );
  }
};



// import { NextResponse } from 'next/server';
// import { db } from '@/lib/db';

// const generateSampleOrders = (months) => {
//   const orders = [];
//   const startDate = new Date();
//   startDate.setMonth(startDate.getMonth() - months);

//   for (let i = 0; i < months; i++) {
//     const currentMonth = new Date(startDate);
//     currentMonth.setMonth(startDate.getMonth() + i);

//     const orderCount = Math.floor(Math.random() * 100) + 1;

//     for (let j = 0; j < orderCount; j++) {
//       orders.push({
//         createdAt: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), Math.floor(Math.random() * 28) + 1), // Random day of the month
//       });
//     }
//   }

//   return orders;
// };

// export const GET = async () => {
//   try {
//     const sampleOrders = generateSampleOrders(6);

//     const ordersPerMonth = sampleOrders.reduce((acc, order) => {
//       const month = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`;
//       if (!acc[month]) {
//         acc[month] = { createdAt: order.createdAt, _count: { id: 0 } };
//       }
//       acc[month]._count.id++;
//       return acc;
//     }, {});

//     const ordersArray = Object.values(ordersPerMonth).sort((a, b) => a.createdAt - b.createdAt);

//     const monthlyOrderCountMap = new Map();

//     ordersArray.forEach(order => {
//       const month = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`;
//       const count = order._count.id;

//       if (monthlyOrderCountMap.has(month)) {
//         monthlyOrderCountMap.set(month, monthlyOrderCountMap.get(month) + count);
//       } else {
//         monthlyOrderCountMap.set(month, count);
//       }
//     });

//     const monthlyOrderCount = Array.from(monthlyOrderCountMap.entries()).map(([month, totalOrders]) => ({
//       month,
//       totalOrders,
//     }));

//     return NextResponse.json({
//       success: true,
//       monthlyOrderCount,
//     });
//   } catch (error) {
//     console.error('Error fetching monthly orders:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to fetch monthly orders' },
//       { status: 500 }
//     );
//   }
// };
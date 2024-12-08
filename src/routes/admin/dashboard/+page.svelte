<script>
    import { onMount } from 'svelte';
    import { Card } from 'flowbite-svelte';
    import Chart from 'chart.js/auto';

    let categorySales = [];
    let subCategoryProducts = [];
    let popularProducts = [];
    let priceDistribution = [];
    let recentActivities = [];

    let categoryChartCanvas;
    let priceChartCanvas;

    const apiBaseUrl = "http://localhost:3000/admin";

    async function fetchDashboardData() {
        try {
            const [salesRes, productsRes, popularRes, priceRes, activitiesRes] = 
                await Promise.all([
                    fetch(`${apiBaseUrl}/dashboard/category-sales`),
                    fetch(`${apiBaseUrl}/dashboard/subcategory-products`),
                    fetch(`${apiBaseUrl}/dashboard/popular-products`),
                    fetch(`${apiBaseUrl}/dashboard/price-distribution`),
                    fetch(`${apiBaseUrl}/dashboard/recent-activities`)
                ]);

            categorySales = await salesRes.json();
            subCategoryProducts = await productsRes.json();
            popularProducts = await popularRes.json();
            priceDistribution = await priceRes.json();
            recentActivities = await activitiesRes.json();

            createCharts();
        } catch (error) {
            console.error('데이터 로딩 실패:', error);
        }
    }

    function createCharts() {
        new Chart(categoryChartCanvas, {
            type: 'bar',
            data: {
                labels: categorySales.map(item => item.category_name),
                datasets: [
                    {
                        label: '총 상품수',
                        data: categorySales.map(item => item.total_count),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)'
                    },
                    {
                        label: '판매완료',
                        data: categorySales.map(item => item.sold_count),
                        backgroundColor: 'rgba(75, 192, 192, 0.5)'
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                }
            }
        });

        new Chart(priceChartCanvas, {
            type: 'doughnut',
            data: {
                labels: priceDistribution.map(item => item.price_range),
                datasets: [{
                    data: priceDistribution.map(item => item.product_count),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    onMount(fetchDashboardData);
</script>
<div class="p-4">
    <h1 class="text-2xl font-bold mb-4">대시보드</h1>

    <div class="grid grid-cols-2 gap-4">
        <Card class="w-full" size="lg">
            <h3 class="text-lg font-bold mb-2">카테고리별 판매 현황</h3>
            <canvas bind:this={categoryChartCanvas}></canvas>
        </Card>

        <Card class="w-full" size="lg">
            <h3 class="text-lg font-bold mb-2">가격대별 상품 분포</h3>
            <canvas bind:this={priceChartCanvas}></canvas>
        </Card>

        <Card class="w-full" size="lg"  >
            <h3 class="text-lg font-bold mb-2">인기 상품 TOP 10</h3>
            <div class="overflow-x-auto">
                <div class="max-h-[400px] overflow-y-auto">
                    <table class="w-full text-sm text-left text-gray-500">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                            <tr>
                                <th class="px-4 py-2">순위</th>
                                <th class="px-4 py-2">상품명</th>
                                <th class="px-4 py-2">카테고리</th>
                                <th class="px-4 py-2">판매자</th>
                                <th class="px-4 py-2">가격</th>
                                <th class="px-4 py-2">조회수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each popularProducts as product, i}
                                <tr class="bg-white border-b">
                                    <td class="px-4 py-2">{i + 1}</td>
                                    <td class="px-4 py-2">{product.title}</td>
                                    <td class="px-4 py-2">{product.category_name}</td>
                                    <td class="px-4 py-2">{product.seller_name}</td>
                                    <td class="px-4 py-2">{product.price.toLocaleString()}원</td>
                                    <td class="px-4 py-2">{product.view_count}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>

        <Card class="w-full" size="lg">
            <h3 class="text-lg font-bold mb-2">최근 거래 활동</h3>
            <div class="max-h-[400px] overflow-y-auto space-y-1">
                {#each recentActivities as activity}
                    <div class="flex justify-between items-center p-2 border-b">
                        <div>
                            <p class="font-medium">{activity.title}</p>
                            <p class="text-sm text-gray-500">{activity.seller_name}</p>
                        </div>
                        <div class="text-right">
                            <p class="font-medium">{activity.price.toLocaleString()}원</p>
                            <p class="text-sm text-gray-500">{activity.status}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </Card>
    </div>
</div>
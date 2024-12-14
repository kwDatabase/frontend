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

    const apiBaseUrl = "http://localhost:3000/dashboard";

    async function fetchDashboardData() {
        try {
            const [salesRes, productsRes, popularRes, priceRes, activitiesRes] = 
                await Promise.all([
                    fetch(`${apiBaseUrl}/category-sales`),
                    fetch(`${apiBaseUrl}/subcategory-products`),
                    fetch(`${apiBaseUrl}/popular-products`),
                    fetch(`${apiBaseUrl}/price-distribution`),
                    fetch(`${apiBaseUrl}/recent-activities`)
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
                        backgroundColor: 'rgba(99, 102, 241, 0.6)'
                    },
                    {
                        label: '판매완료',
                        data: categorySales.map(item => item.sold_count),
                        backgroundColor: 'rgba(52, 211, 153, 0.6)'
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
                        'rgba(99, 102, 241, 0.6)',
                        'rgba(52, 211, 153, 0.6)', 
                        'rgba(251, 146, 60, 0.6)',
                        'rgba(147, 51, 234, 0.6)',
                        'rgba(236, 72, 153, 0.6)'
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

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-800 dark:text-white">대시보드</h1>

    <div class="grid grid-cols-2 gap-8">

        <Card class="w-full shadow-lg hover:shadow-xl transition-shadow duration-300" size="lg">
            <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">인기 상품 TOP 10</h3>
            <div class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg">
                <div class="max-h-[400px] overflow-y-auto">
                    <table class="w-full text-sm">
                        <thead class="text-xs uppercase bg-gray-100 dark:bg-gray-700 sticky top-0">
                            <tr>
                                <th class="px-6 py-3 text-gray-700 dark:text-gray-300">순위</th>
                                <th class="px-6 py-3 text-gray-700 dark:text-gray-300">상품명</th>
                                <th class="px-6 py-3 text-gray-700 dark:text-gray-300">카테고리</th>
                                <th class="px-6 py-3 text-gray-700 dark:text-gray-300">판매자</th>
                                <th class="px-6 py-3 text-gray-700 dark:text-gray-300">가격</th>
                                <th class="px-6 py-3 text-gray-700 dark:text-gray-300">조회수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each popularProducts as product, i}
                                <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                                    <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{i + 1}</td>
                                    <td class="px-6 py-4 text-gray-800 dark:text-gray-200">{product.title}</td>
                                    <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{product.category_name}</td>
                                    <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{product.seller_name}</td>
                                    <td class="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">{product.price.toLocaleString()}원</td>
                                    <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{product.view_count}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>

        <Card class="w-full shadow-lg hover:shadow-xl transition-shadow duration-300" size="lg">
            <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">최근 거래 활동</h3>
            <div class="max-h-[400px] overflow-y-auto space-y-3 bg-white dark:bg-gray-800 rounded-lg p-4">
                {#each recentActivities as activity}
                    <div class="flex justify-between items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <div>
                            <p class="font-medium text-gray-800 dark:text-white mb-1">{activity.title}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">{activity.seller_name}</p>
                        </div>
                        <div class="text-right">
                            <p class="font-medium text-indigo-600 dark:text-indigo-400 mb-1">{activity.price.toLocaleString()}원</p>
                            <p class="text-sm text-emerald-600 dark:text-emerald-400">{activity.status}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </Card>

        <Card class="w-full shadow-lg hover:shadow-xl transition-shadow duration-300" size="lg">
            <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">카테고리별 판매 현황</h3>
            <div class="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <canvas bind:this={categoryChartCanvas}></canvas>
            </div>
        </Card>

        <Card class="w-full shadow-lg hover:shadow-xl transition-shadow duration-300" size="lg">
            <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">가격대별 상품 분포</h3>
            <div class="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <canvas bind:this={priceChartCanvas}></canvas>
            </div>
        </Card>
    </div>
</div>
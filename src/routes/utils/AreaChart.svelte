<script>
    import { Chart, Card, A, Button, Dropdown, DropdownItem, Heading } from 'flowbite-svelte';
    import { ChevronRightOutline, ChevronDownOutline } from 'flowbite-svelte-icons';
    // 선택된 기간
    let selectedPeriod = '지난 주';

    // API 호출 함수
    // async function fetchData(period) {
    //     console.log(`Fetching data for: ${period}`);
    //     const response = await fetch(`https://api/data?period=${encodeURIComponent(period)}`);
    //     const data = await response.json();
    //     console.log(data);
    // }

    // Dropdown 선택 변경 핸들러
    // function handleSelect(period) {
    //     selectedPeriod = period;
    //     fetchData(period);
    // }
  // 로딩 상태
  let isLoading = false;

  // Mock API 호출 함수
  async function fetchData(period) {
    isLoading = true;
    try {
      console.log(`Fetching data for: ${period}`);
      // const response = await fetch(`https://api/data?period=${encodeURIComponent(period)}`);
      // const data = await response.json();
      // console.log(data);
    } 
    catch (error) {
      console.error('Error fetching data:', error);
      return [];
    } 
    finally {
      isLoading = false;
    }
  }

  function get_string(period){
    switch(period){
      case "current_week":
        return "이번 주";
      case "previous_week":
        return "지난 주";
      case "current_month":
        return "이번 달";
      case "previous_month":
        return "지난 달";
    }
  }

  // 드롭다운 선택 핸들러
  async function handleSelect(period) {
    selectedPeriod = get_string(period);

    // 데이터 가져오기
    const newData = await fetchData(period);

    // 차트 업데이트
    options.series = [{ name: 'Users', data: newData }];
    options.xaxis.categories = []

  }
    
    let options = {
      chart: {
        height: '400px',
        maxWidth: '100%',
        type: 'area',
        fontFamily: 'Inter, sans-serif',
        dropShadow: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      tooltip: {
        enabled: true,
        x: {
          show: false
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: '#1C64F2',
          gradientToColors: ['#1C64F2']
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 6
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: 0
        }
      },
      xaxis: {
        categories: ['01 February', '02 February', '03 February', '04 February', '05 February', '06 February', '07 February'],
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        show: false
      }
    };

  options.series = [
    {
      name: 'Users',
      data: [23, 43, 23, 44, 1],
      color: '#1A56DB'
    },
  ];
  </script>
  
  <Card size="xl" class="w-full max-w-none 2xl:col-span-2">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex-shrink-0">
        <Heading tag="h3" class="text-2xl">test</Heading>
        <p class="text-base font-light text-gray-500 dark:text-gray-400">test</p>
      </div>
    </div>
  
    <Chart options={options}></Chart>
    <div
      class="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
    </div>
  </Card>
<script>
    import { Chart, Card, A, Button, Dropdown, DropdownItem, Popover, Tooltip, Heading } from 'flowbite-svelte';
    import { InfoCircleSolid, ArrowDownToBracketOutline, ChevronDownOutline, ChevronRightOutline, PenSolid, DownloadSolid, ShareNodesSolid } from 'flowbite-svelte-icons';
  
    const options = {
      series: [35.1, 23.5, 2.4, 5.4],
      colors: ['#1C64F2', '#16BDCA', '#FDBA8C', '#E74694'],
      chart: {
        height: 320,
        width: '100%',
        type: 'donut'
      },
      stroke: {
        colors: ['transparent'],
        lineCap: ''
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: 'Inter, sans-serif',
                offsetY: 20
              },
              total: {
                showAlways: true,
                show: true,
                label: 'Unique visitors',
                fontFamily: 'Inter, sans-serif',
                formatter: function (w) {
                  const sum = w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                  return `${sum}k`;
                }
              },
              value: {
                show: true,
                fontFamily: 'Inter, sans-serif',
                offsetY: -20,
                formatter: function (value) {
                  return value + 'k';
                }
              }
            },
            size: '80%'
          }
        }
      },
      grid: {
        padding: {
          top: -2
        }
      },
      labels: ['Direct', 'Sponsor', 'Affiliate', 'Email marketing'],
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'bottom',
        fontFamily: 'Inter, sans-serif'
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value;
          }
        }
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value;
          }
        },
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      }
    };
  </script>
  
  <Card size="xl" class="w-full max-w-none 2xl:col-span-2">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex-shrink-0">
        <Heading tag="h3" class="text-2xl">상품 카테고리 별 현황</Heading>
        <p class="text-base font-light text-gray-500 dark:text-gray-400">test</p>
      </div>
    </div>
  
    <Chart {options} class="py-6" />
  
    <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
      <div class="flex justify-between items-center pt-5">
        <Button class="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent focus:ring-transparent dark:focus:ring-transparent py-0">Last 7 days<ChevronDownOutline class="w-2.5 m-2.5 ms-1.5" /></Button>
        <Dropdown class="w-40" offset="-6">
          <DropdownItem>Yesterday</DropdownItem>
          <DropdownItem>Today</DropdownItem>
          <DropdownItem>Last 7 days</DropdownItem>
          <DropdownItem>Last 30 days</DropdownItem>
          <DropdownItem>Last 90 days</DropdownItem>
        </Dropdown>
      </div>
    </div>
  </Card>
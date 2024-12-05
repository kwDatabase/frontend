<script>
    import AreaChart from '../../utils/AreaChart.svelte';
    import DonutChart from '../../utils/DonutChart.svelte';
  import { Card, Chart } from 'flowbite-svelte';
  import thickbars from '../../utils/graphs/thickbars';
</script>


<div class="mt-px space-y-4">
    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <!-- <div class="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-1"> -->
<AreaChart>
</AreaChart>
<!-- <div class="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3"> -->
    <DonutChart></DonutChart>
<!-- </div> -->

</div>

<div class="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
    <Card horizontal class="items-center justify-between" size="xl">
      <div class="w-full">
        <p>New products</p>
        <p class="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
          2,340
        </p>
      </div>
      <Chart options={thickbars} class="w-full" />
    </Card>
    <Card horizontal class="items-center justify-between" size="xl">
      <div class="w-full">
        <p>Users</p>
        <p class="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
          4,420
        </p>
      </div>
    </Card>
    <Card horizontal class="items-center justify-between" size="xl">
      <div class="w-full">
        <p>Users</p>
        <p class="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
          4,420
        </p>
      </div>
    </Card>
  </div>
</div>
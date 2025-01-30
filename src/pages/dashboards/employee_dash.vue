<script lang="ts" setup>
import EcommerceCongratulationsJohn from '@/views/dashboards/employee/EcommerceCongratulationsJohn.vue'
import EcommerceStatistics from '@/views/dashboards/employee/EcommerceStatistics.vue'
import EcommerceTotalProfitLineCharts from '@/views/dashboards/employee/EcommerceTotalProfitLineCharts.vue'
import EcommerceExpensesRadialBarCharts from '@/views/dashboards/employee/EcommerceExpensesRadialBarCharts.vue'
import EcommerceGeneratedLeads from '@/views/dashboards/employee/EcommerceGeneratedLeads.vue'
import EcommerceRevenueReport from '@/views/dashboards/employee/EcommerceRevenueReport.vue'
import EcommerceEarningReports from '@/views/dashboards/employee/EcommerceEarningReports.vue'
import EcommercePopularProducts from '@/views/dashboards/employee/EcommercePopularProducts.vue'
import EcommerceOrder from '@/views/dashboards/employee/EcommerceOrder.vue'
import EcommerceTransactions from '@/views/dashboards/employee/EcommerceTransactions.vue'
import EcommerceInvoiceTable from '@/views/dashboards/employee/EcommerceInvoiceTable.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 Congratulation John -->
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <EcommerceCongratulationsJohn />
    </VCol>

    <!-- 👉 Ecommerce Transition -->
    <VCol
      cols="12"
      md="7"
      lg="8"
    >
      <EcommerceStatistics class="h-100" />
    </VCol>

    <VCol
      cols="12"
      lg="4"
    >
      <VRow>
        <!-- 👉 Total Profit Line -->
        <VCol
          cols="12"
          lg="6"
          md="3"
          sm="6"
        >
          <EcommerceTotalProfitLineCharts />
        </VCol>

        <!-- 👉 Expenses Radial Bar Charts -->
        <VCol
          cols="12"
          lg="6"
          md="3"
          sm="6"
        >
          <EcommerceExpensesRadialBarCharts />
        </VCol>

        <!-- 👉 Generated Leads -->
        <VCol
          cols="12"
          md="6"
          lg="12"
        >
          <EcommerceGeneratedLeads />
        </VCol>
      </VRow>
    </VCol>

    <!-- 👉 Revenue Report -->
    <VCol
      cols="12"
      lg="8"
    >
      <EcommerceRevenueReport />
    </VCol>

    <!-- 👉 Earning Reports -->
<!--    <VCol-->
<!--      cols="12"-->
<!--      sm="6"-->
<!--      lg="4"-->
<!--    >-->
<!--      <EcommerceEarningReports />-->
<!--    </VCol>-->

    <!-- 👉 Popular Products -->
<!--    <VCol-->
<!--      cols="12"-->
<!--      sm="6"-->
<!--      lg="4"-->
<!--    >-->
<!--      <EcommercePopularProducts />-->
<!--    </VCol>-->

    <!-- 👉 Order -->
<!--    <VCol-->
<!--      cols="12"-->
<!--      sm="6"-->
<!--      lg="4"-->
<!--    >-->
<!--      <EcommerceOrder />-->
<!--    </VCol>-->

<!--    &lt;!&ndash; 👉 Transaction &ndash;&gt;-->
<!--    <VCol-->
<!--      cols="12"-->
<!--      sm="6"-->
<!--      lg="4"-->
<!--    >-->
<!--      <EcommerceTransactions />-->
<!--    </VCol>-->

    <!-- 👉 Invoice Table -->
<!--    <VCol-->
<!--      cols="12"-->
<!--      lg="8"-->
<!--    >-->
<!--      <EcommerceInvoiceTable />-->
<!--    </VCol>-->
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>

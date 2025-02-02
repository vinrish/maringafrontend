<script setup lang="ts">
import { VIcon } from 'vuetify/components/VIcon'
import sliderBar1 from '@images/illustrations/sidebar-pic-1.png'
import sliderBar2 from '@images/illustrations/sidebar-pic-2.png'
import sliderBar3 from '@images/illustrations/sidebar-pic-3.png'

const props = defineProps({
  platformAnalytics: {
    type: Object,
    required: true,
  },
})

const websiteAnalytics = [
  {
    name: 'Clients',
    slideImg: sliderBar1,
    data: [
      {
        number: props.platformAnalytics.active_clients,
        text: 'Active',
      },
      {
        number: props.platformAnalytics.inactive_clients,
        text: 'In Active',
      },
      {
        number: props.platformAnalytics.new_clients,
        text: 'New',
      },
      {
        number: '12%',
        text: 'Platform visits',
      },
    ],
  },
  {
    name: 'Companies',
    slideImg: sliderBar2,
    data: [
      {
        number: '12h',
        text: 'Active',
      },
      {
        number: '182',
        text: 'In Active',
      },
      {
        number: props.platformAnalytics.new_companies,
        text: 'New',
      },
      {
        number: '23k',
        text: 'Employees',
      },
    ],
  },
  {
    name: 'Businesses',
    slideImg: sliderBar3,
    data: [
      {
        number: '12h',
        text: 'Active',
      },
      {
        number: '182',
        text: 'In Active',
      },
      {
        number: props.platformAnalytics.new_businesses,
        text: 'New',
      },
      {
        number: '23k',
        text: 'Employees',
      },
    ],
  },
]
</script>

<template>
  <VCard
    color="primary"
    height="260"
  >
    <VCarousel
      cycle
      :continuous="false"
      :show-arrows="false"
      hide-delimiter-background
      :delimiter-icon="() => h(VIcon, { icon: 'fa-circle', size: '8' })"
      height="260"
      class="carousel-delimiter-top-end web-analytics-carousel"
    >
      <VCarouselItem
        v-for="item in websiteAnalytics"
        :key="item.name"
      >
        <VCardText class="position-relative">
          <VRow>
            <VCol cols="12">
              <h5 class="text-h5 text-white">
                Platform Analytics
              </h5>
<!--              <p class="text-sm mb-0">-->
<!--                Total 28.5% Conversion Rate-->
<!--              </p>-->
            </VCol>

            <VCol
              cols="12"
              sm="6"
              order="2"
              order-sm="1"
            >
              <VRow>
                <VCol
                  cols="12"
                  class="pb-0 pt-1"
                >
                  <h6 class="text-h6 text-white mb-1 mt-5">
                    {{ item.name }}
                  </h6>
                </VCol>

                <VCol
                  v-for="d in item.data"
                  :key="d.number"
                  cols="6"
                  class="text-no-wrap pb-2"
                >
                  <VChip
                    label
                    variant="flat"
                    size="default"
                    color="rgb(var(--v-theme-primary-darken-1))"
                    class="font-weight-medium text-white rounded me-2 px-2"
                    style="block-size: 30px;"
                  >
                    <span class="text-base">{{ d.number }}</span>
                  </VChip>
                  <span class="d-inline-block">{{ d.text }}</span>
                </VCol>
              </VRow>
            </VCol>

            <VCol
              cols="12"
              sm="6"
              order="1"
              order-sm="2"
              class="text-center"
            >
              <img
                :src="item.slideImg"
                class="card-website-analytics-img"
                style="filter: drop-shadow(0 4px 60px rgba(0, 0, 0, 50%));"
              >
            </VCol>
          </VRow>
        </VCardText>
      </VCarouselItem>
    </VCarousel>
  </VCard>
</template>

<style lang="scss">
.card-website-analytics-img {
  block-size: 150px;
}

@media screen and (min-width: 600px) {
  .card-website-analytics-img {
    position: absolute;
    margin: auto;
    inset-block-end: 1rem;
    inset-inline-end: 2.5rem;
  }
}

.web-analytics-carousel {
  .v-carousel__controls {
    .v-carousel__controls__item {
      &.v-btn--active {
        .v-icon {
          opacity: 1 !important;
        }
      }
    }
  }
}
</style>

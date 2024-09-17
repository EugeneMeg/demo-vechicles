<script lang="ts">
import axios from 'axios';
import plusIcon from '@/assets/icons/plus.svg?raw';

export default {
    data() {
        return {
            vechicles: null,
            total: 0,
            locales: {
                en: 'En',
                ru: 'Ru',
                zh_tw: '中文 (繁體)',
            },
            apiParams: {
                search: '',
                per_page: 9,
            },
            perPageFilters: [6, 9],
            currentLocale: 'En',
            isActiveLangSelector: false,
            isActiveCountFilter: false,
            plusIcon,
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData(request_url?: string | null): Promise<void> {
            let currentRequestUrl = 'https://api.caiman-app.de/api/cars-test';

            if (request_url) {
                currentRequestUrl = request_url;
            }
            const { data } = await axios.get(currentRequestUrl, {
                params: this.apiParams,
            });

            this.vechicles = data;

            if (this.vechicles) {
                this.total = this.vechicles['meta']['total'];
            }
        },

        toggleLangSelector(): void {
            this.isActiveLangSelector = !this.isActiveLangSelector;
        },

        closeLangSelector(): void {
            this.isActiveLangSelector = false;
        },

        setCurrentLocale(locale: string): void {
            this.currentLocale = locale;
        },

        toggleCountFilter(): void {
            this.isActiveCountFilter = !this.isActiveCountFilter;
        },

        closeCountFilter(): void {
            this.isActiveCountFilter = false;
        },

        setPerPage(per_page: number): void {
            this.apiParams.per_page = per_page;

            this.fetchData();
        },

        getDaysLeft(ms: number) {
            const now = +new Date();
            const createdAt = +new Date(ms);
            const diff = Math.abs(now - createdAt);

            return Math.floor(diff / (24*60*60*1000));
        },
    },
};
</script>

<template>
    <div class="info">
        <div class="container">
            <div class="info__in">
                <div class="info__wrap">
                    <h1 class="info__title">
                        Vechicles
                    </h1>

                    <div class="info__label" v-text="total"></div>
                </div>

                <div class="info__wrap">
                    <button type="button" class="info__plus" v-html="plusIcon"></button>

                    <div class="info__user">
                        <img src="@/assets/img/user.png" srcset="@/assets/img/user@2x.png 2x" class="info__user-avatar">

                        <div class="info__user-name">
                            John Doe
                        </div>
                    </div>

                    <div
                        class="info__lang-selector"
                        :class="[{'info__lang-selector--active': isActiveLangSelector}, `info__lang-selector--${currentLocale.toLowerCase()}`]"
                        @click="toggleLangSelector"
                        v-click-outside="closeLangSelector"
                    >
                        {{ currentLocale }}

                        <div class="info__langs" v-if="isActiveLangSelector">
                            <div
                                v-for="k, v in locales"
                                class="info__lang"
                                :class="`info__lang--${v}`"
                                @click="setCurrentLocale(k)"
                            >
                                {{ k }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="controls">
            <div class="controls__search">
                <input
                    type="text"
                    class="controls__search-input"
                    placeholder="Search VIN"
                    v-model="apiParams.search"
                    @input="fetchData"
                    @keyup.enter="fetchData"
                >
            </div>

            <div class="controls__count">
                Select vehicles per page:

                <div
                    class="controls__count-selector"
                    :class="{'controls__count-selector--active': isActiveCountFilter}"
                    @click="toggleCountFilter"
                    v-click-outside="closeCountFilter"
                >
                    {{ apiParams.per_page }}

                    <div class="controls__count-list" v-if="isActiveCountFilter">
                        <div
                            v-for="filter in perPageFilters"
                            class="controls__count-item"
                            @click="setPerPage(filter)"
                        >
                            {{ filter }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="controls__button">
                <button
                    type="button"
                    class="button button--plus button--red"
                >
                    <div class="icon icon--white" v-html="plusIcon"></div>

                    Add Vechicle
                </button>
            </div>
        </div>
    </div>

    <div class="vechicles">
        <div class="container">
            <div class="vechicles__in">
                <div
                    v-for="vechicle in vechicles['data']"
                    class="vechicles__vechicle"
                    v-if="vechicles && vechicles['data']"
                >
                    <img :src="vechicle.photo.processed_url" class="vechicles__vechicle-img">

                    <div class="vechicles__vechicle-name" v-if="vechicle.vehicle_name">
                        {{ vechicle.vehicle_name }}
                    </div>

                    <div class="vechicles__vechicle-vin" v-if="vechicle.vin">
                        WDB {{ vechicle.vin }}
                    </div>

                    <div class="vechicles__vechicle-info">
                        <div class="vechicles__vechicle-count" v-text="`${vechicle.uploads}/30`"></div>

                        <div class="vechicles__vechicle-date">
                            {{ getDaysLeft(vechicle.created_at) }} days left
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="pagination" v-if="vechicles">
        <div class="container">
            <div class="pagination__in">
                <div class="pagination__info">
                    Showing {{ apiParams.per_page }} out of {{ total }} 
                </div>

                <div class="pagination__pagination">
                    <button
                        type="button"
                        class="pagination__button pagination__button--prev"
                        :disabled="!vechicles['links']['prev']"
                    >
                    </button>

                    <div class="pagination__input-wrap">
                        <input
                            type="text"
                            class="pagination__input"
                            :value="vechicles['meta']['current_page']"
                        >
                    </div>

                    of

                    <div class="pagination__input-wrap">
                        <input
                            type="text"
                            class="pagination__input"
                            :value="vechicles['meta']['last_page']"
                            disabled
                        >
                    </div>

                    <button
                        type="button"
                        class="pagination__button pagination__button--next"
                        :disabled="!vechicles['links']['next']"
                        @click="fetchData(vechicles['links']['next'])"
                    >
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

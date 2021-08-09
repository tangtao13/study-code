<template>
    <div>
        <router-link to="/about" custom v-slot="{ href, route, navigate, isActive, isExactActive }">
            <Navlink :active="isActive" :href="href" @click="navigate">
                {{ route.fullPath }}
            </Navlink>
        </router-link>

        <router-link to="/foo" v-slot="href,route,navigate,isActive,isExactActive}" custom>
            <li :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']">
                <a :href="href" @click="navigate">{{ route.fullPath }}</a>
            </li>
        </router-link>
    </div>
</template>
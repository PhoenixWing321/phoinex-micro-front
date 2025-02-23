<template>
    <div class="collapsible-group">
        <div class="group-header" @click="toggleCollapse">
            <h3 class="group-title">{{ title }}</h3>
            <el-icon class="collapse-icon" :class="{ 'is-collapsed': isCollapsed }">
                <ArrowDown />
            </el-icon>
        </div>
        <div class="group-content" :class="{ 'is-collapsed': isCollapsed }">
            <div class="scrollable-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';

export default defineComponent({
    name: 'CollapsibleGroup',
    components: { ArrowDown },
    props: {
        title: {
            type: String,
            required: true
        }
    },
    setup() {
        const isCollapsed = ref(false);

        const toggleCollapse = () => {
            isCollapsed.value = !isCollapsed.value;
        };

        return {
            isCollapsed,
            toggleCollapse
        };
    }
});
</script>

<style scoped>
.collapsible-group {
    border-top: 1px solid #e6e6e6;
    margin-top: 10px;
}

.group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background-color: #f8f9fa;
    cursor: pointer;
    user-select: none;
}

.group-title {
    margin: 0;
    font-size: 14px;
    color: #909399;
}

.collapse-icon {
    transition: transform 0.3s;
}

.collapse-icon.is-collapsed {
    transform: rotate(-180deg);
}

.group-content {
    transition: max-height 0.3s;
    max-height: 300px;
    overflow: hidden;
}

.group-content.is-collapsed {
    max-height: 0;
}

.scrollable-content {
    max-height: 300px;
    overflow-y: auto;
    scrollbar-width: thin;
}

/* 自定义滚动条样式 */
.scrollable-content::-webkit-scrollbar {
    width: 6px;
}

.scrollable-content::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.scrollable-content::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
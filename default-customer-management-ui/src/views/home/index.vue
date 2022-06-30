<template lang="pug">
    .index
        squadron-home(v-if="deptLevel === 5")
        brigade-home(v-else-if="deptLevel === 4")
        detachment-home(v-else-if="deptLevel === 3")
        corps-home(v-else-if="deptLevel === 2")
        bureau-home(v-else-if="deptLevel === 1")
</template>

<script>
    import {mapGetters} from "vuex";
    // 部局首页
    import bureauHome from './components/bureauHome';
    // 总队首页
    import corpsHome from "./components/corpsHome";
    // 支队首页
    import detachmentHome from "./components/detachmentHome";
    // 大队首页
    import brigadeHome from "./components/brigadeHome";
    // 中队首页
    import squadronHome from "./components/squadronHome";

    export default {
        name: "Index",
        components: {
            bureauHome,
            corpsHome,
            detachmentHome,
            brigadeHome,
            squadronHome
        },
        computed: {
            ...mapGetters(["deptLevel"])
        }
    };
</script>

<style lang="stylus">
    @import '~@/assets/styles/mixin.styl'
    // 多个首页通用样式
    @media only screen and (min-width: 1200px) and (max-width: 1920px)
        .panel_group
            display flex
            align-items center
            justify-content space-between
            .panel_item
                flex 1
                margin 0 10px 0 0
                font-size 12px

    .indexPage
        width 100%
        padding 20px 15px
        background rgba(241, 247, 252, 1)
        .el-badge__content.is-fixed
            transform translateY(0%) translateX(100%)
        .top
            display flex
            margin-bottom 15px
            div
                margin-right 20px
            .etlTime
                margin-left auto
                line-height 33px
                .time
                    padding 0px 5px
                    color red
        .section
            background-color #fff
            box-shadow 0px 0px 8px 0px rgba(0, 54, 104, 0.25)
            border-radius 10px
        .panel_group
            color #437FDF
            padding 15px 15px 20px
            margin-bottom 15px
            .panel_item
                height 100px
                padding 0
                justify-content space-between
                background rgba(241, 246, 252, 1)
                box-shadow 0px 5px 6px 0px rgba(218, 233, 250, 1)
                border-radius 4px
                position relative
                &::before
                    content ' '
                    position absolute
                    left 0
                    top 0
                    width 5px
                    height 100%
                    background rgba(67, 127, 223, 1)
                    border-radius 4px 0px 0px 4px
                .label
                    height 18px
                    margin 11px 0 0 0
                    img
                        float left
                        height 18px
                        margin: 0 8px 0 15px
                    h5
                        float left
                        height 18px
                        line-height 18px
                        font-size 12px
                        font-weight normal
                .statistic-num
                    text-align center
                    margin 7px 0
                    b
                        font-size 25px
                        margin 0 3px 0 0
                    .unit
                        font-size 12px
                .trend
                    font-size 12px
                    text-align center
                    &.up
                        color #fb360e

    .content
        .section
            margin-bottom 15px
            padding 15px
            // 保持高度一致
            height 450px
            // min-height 450px
            .el-tabs
                height 100%
                .list_group
                    margin 0
                    list-style none
                    padding 0
                    .list_item
                        list-style none
                        border-bottom 1px dashed #dfe4ed
                        padding 10px 5px
                        &_cursor
                            cursor pointer
                        &_link
                            cursor pointer
                            line-height 36px
                            margin 10px 0
                            &:hover
                                box-shadow 0px 3px 10px 1px $default-border-color
                        &:nth-last-child(1)
                            border-bottom none
                        .list_title
                            color #333333
                            line-height 30px
                            font-weight 600
                            font-size 14px
                            .tag_dot
                                font-size 10px
                                color red
                                font-weight 500
                                padding-left 6px
                        .list_detail
                            line-height 25px
                            display flex
                            justify-content space-between
                            color #777777
                            font-size 12px
                            align-items flex-end
                            & > :first-child
                                flex 1
                                margin 0 10px 0 0
                                textmoreline()
                                max-height 50px
                                p
                                    margin 0px
                            & > :last-child
                                text-align right
                                width 120px
            .chart_title
                color '#333333'
                line-height 30px
                position relative
                padding-left 10px
                font-size 16px
                font-weight 600
                &::before
                    content ' '
                    display inline-block
                    position absolute
                    top 0
                    left 0
                    margin-top 5px
                    width 3px
                    height 18px
                    background rgba(67, 127, 223, 1)
            .section_title
                display flex
                justify-content space-between
                margin-bottom 10px
            .map_zone
                width 100%
                height 420px
                position relative
                .show-china-map
                    position absolute
                    left 0
                    top 0
                    z-index 1
            .bar_zone
                width 100%
                height 350px
            .line_zone
                width 100%
                height 320px
            .summary-chart
                width 100%
                height 280px
            .pie_zone
                width 100%
                height 430px
            .swipe_zone
                width 100%
                height 420px
                font-size 12px
                .el-carousel__item
                    padding 10px 0
                    display flex
                    flex-direction column
                .carousel-title
                    line-height 36px
                    padding 0 20px
                .carousel-content
                    display flex
                    align-items center
                    margin 0 0 20px 0
                    padding 0 15px
                    .carousel-name
                        width 60px
                        textoneline()
                    .carousel-line
                        flex 1
                        background-color rgba(0, 0, 0, 0.05)
                        height 8px
                        border-radius 10px
                        overflow hidden
                        .line-active
                            height 100%
                            border-radius 10px
                            background linear-gradient(90deg, rgba(79, 202, 251, 0.8) 0%, rgba(0, 78, 208, 0.8) 100%)
                    .carousel-num
                        font-size 12px
                        margin 0 0 0 10px
                        min-width 50px
                        text-align right
                        color $default-blue-color
            .rank-list
                height 400px
                ul
                    margin 0
                    padding 0
                    li
                        list-style-type none
                        height 40px
                        display flex
                        justify-content space-between
                        flex-wrap nowrap
                        align-items center
                        .rank-num
                            display inline-flex
                            width 20px
                            height 20px
                            font-size 15px
                            color #555555
                            flex-shrink 0
                            justify-content center
                            align-items center
                            &.medal-gold
                                background url("./image/rank-1.png") no-repeat center center
                                background-size auto 20px
                            &.medal-silver
                                background url("./image/rank-2.png") no-repeat center center
                                background-size auto 20px
                            &.medal-bronze
                                background url("./image/rank-3.png") no-repeat center center
                                background-size auto 20px
                        .team
                            display inline-flex
                            min-width 0
                            height 40px
                            line-height 40px
                            flex-grow 1
                            flex-shrink 1
                            span
                                display: block
                                color #333333
                                font-size 14px
                                overflow hidden
                                white-space nowrap
                                text-overflow ellipsis
                                padding 0 8px
                        .count
                            display inline-flex
                            flex-shrink 0
                            height 40px
                            line-height 40px
                            color #777777
                            font-size 12px

        .txt_zone
            padding 22px 25px 0
            font-size 14px
            // line-height: 35px;
            .orange
                color #F77006
                font-weight bold
                margin 0 2px
        .section_spe
            min-height 500px
    /deep/
        .el-tabs__header.is-top
            margin-bottom 0px
        .el-tabs__item.is-top.is-active
            background rgba(67, 127, 223, 1)
            border-radius 2px 2px 0px 0px
            color #fff
        .el-carousel__item
            padding 0px
        .el-carousel__indicator.el-carousel__indicator--horizontal.is-active .el-carousel__button
            width 10px
            height 10px
            background-color #437FDF
            margin-top 0px
        .el-carousel__arrow
            &:hover
                background-color #437FDF
</style>

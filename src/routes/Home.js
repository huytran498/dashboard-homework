import React, { useState } from "react";
import styles from './Home.module.scss';
import * as Md from "../md/full";
import Page from "../components/Page";
import { modifyMeasure } from "@gooddata/sdk-model";
import { LineChart } from "@gooddata/sdk-ui-charts";
import { DateFilter, DateFilterHelpers } from "@gooddata/sdk-ui-filters";
import { Calculator } from "../components/CustomComponents/Calculator";

const productRevenue = modifyMeasure(Md.Revenue, (cr) => cr.format("#,##0").title("Product Revenue"));
const measures = [productRevenue];

const dateFrom = new Date();
dateFrom.setMonth(dateFrom.getMonth() - 1);

const availableGranularities = ["GDC.time.date", "GDC.time.month", "GDC.time.quarter", "GDC.time.year"];

const defaultDateFilterOptions = {
    allTime: {
        localIdentifier: "ALL_TIME",
        type: "allTime",
        name: "",
        visible: true,
    },

    absoluteForm: {
        localIdentifier: "ABSOLUTE_FORM",
        type: "absoluteForm",
        from: dateFrom.toISOString().slice(0, 10), // 'YYYY-MM-DD'
        to: new Date().toISOString().slice(0, 10), // 'YYYY-MM-DD'
        name: "",
        visible: true,
    },

    absolutePreset: [
        {
            from: "2019-12-24",
            to: "2019-12-26",
            name: "Christmas 2019",
            localIdentifier: "christmas-2019",
            visible: true,
            type: "absolutePreset",
        },

        {
            from: "2018-01-01",
            to: "2018-12-31",
            name: "Year 2018",
            localIdentifier: "year-2018",
            visible: true,
            type: "absolutePreset",
        },
    ],

    relativeForm: {
        localIdentifier: "RELATIVE_FORM",
        type: "relativeForm",
        granularity: "GDC.time.month",
        from: undefined,
        to: undefined,
        name: "",
        visible: true,
    },

    relativePreset: {
        "GDC.time.date": [
            {
                from: -6,
                to: 0,
                granularity: "GDC.time.date",
                localIdentifier: "LAST_7_DAYS",
                type: "relativePreset",
                visible: true,
                name: "Last 7 days",
            },

            {
                from: -29,
                to: 0,
                granularity: "GDC.time.date",
                localIdentifier: "LAST_30_DAYS",
                type: "relativePreset",
                visible: true,
                name: "Last 30 days",
            },

            {
                from: -89,
                to: 0,
                granularity: "GDC.time.date",
                localIdentifier: "LAST_90_DAYS",
                type: "relativePreset",
                visible: true,
                name: "Last 90 days",
            },
        ],

        "GDC.time.month": [
            {
                from: 0,
                to: 0,
                granularity: "GDC.time.month",
                localIdentifier: "THIS_MONTH",
                type: "relativePreset",
                visible: true,
                name: "This month",
            },

            {
                from: -1,
                to: -1,
                granularity: "GDC.time.month",
                localIdentifier: "LAST_MONTH",
                type: "relativePreset",
                visible: true,
                name: "Last month",
            },

            {
                from: -11,
                to: 0,
                granularity: "GDC.time.month",
                localIdentifier: "LAST_12_MONTHS",
                type: "relativePreset",
                visible: true,
                name: "Last 12 months",
            },
        ],

        "GDC.time.quarter": [
            {
                from: 0,
                to: 0,
                granularity: "GDC.time.quarter",
                localIdentifier: "THIS_QUARTER",
                type: "relativePreset",
                visible: true,
                name: "This quarter",
            },

            {
                from: -1,
                to: -1,
                granularity: "GDC.time.quarter",
                localIdentifier: "LAST_QUARTER",
                type: "relativePreset",
                visible: true,
                name: "Last quarter",
            },

            {
                from: -3,
                to: 0,
                granularity: "GDC.time.quarter",
                localIdentifier: "LAST_4_QUARTERS",
                type: "relativePreset",
                visible: true,
                name: "Last 4 quarters",
            },
        ],

        "GDC.time.year": [
            {
                from: 0,
                to: 0,
                granularity: "GDC.time.year",
                localIdentifier: "THIS_YEAR",
                type: "relativePreset",
                visible: true,
                name: "This year",
            },

            {
                from: -1,
                to: -1,
                granularity: "GDC.time.year",
                localIdentifier: "LAST_YEAR",
                type: "relativePreset",
                visible: true,
                name: "Last year",
            },
            {
                from: -2,
                to: -2,
                granularity: "GDC.time.year",
                localIdentifier: "twoYearsAgo",
                type: "relativePreset",
                visible: true,
                name: "2 years ago",
            },
            {
                from: -3,
                to: -3,
                granularity: "GDC.time.year",
                localIdentifier: "threeYearsAgo",
                type: "relativePreset",
                visible: true,
                name: "3 years ago",
            },

            {
                from: -4,
                to: -4,
                granularity: "GDC.time.year",
                localIdentifier: "fourYearsAgo",
                type: "relativePreset",
                visible: true,
                name: "4 years ago",
            },
        ],
    },
};

const Home = () => {
    const [state, setState] = useState({
        selectedFilterOption: defaultDateFilterOptions.allTime,
        excludeCurrentPeriod: false,
    });

    const onApply = (selectedFilterOption, excludeCurrentPeriod) => {
        setState({
            selectedFilterOption,
            excludeCurrentPeriod,
        });
    };

    const dateFilter = DateFilterHelpers.mapOptionToAfm(
        state.selectedFilterOption,
        Md.DateDatasets.Date.ref,
        state.excludeCurrentPeriod,
    );

    const displayDashboardTitle = (type) => {
        let dashboardTitle = "";
        switch(type) {
            case ("allTime"):
                dashboardTitle = "All time";
                break;
            case ("absoluteForm"):
                dashboardTitle = "From " + state.selectedFilterOption.from + " to " +  state.selectedFilterOption.to;
                break;
            case ("relativeForm"):
                dashboardTitle = convertRelativeFormType();
                break;
            case ("absolutePreset"):
                dashboardTitle = state.selectedFilterOption.name;
                break;    
            case ("relativePreset"):
                dashboardTitle = state.selectedFilterOption.name;
                break;
            default:
                break;
        }
        return dashboardTitle;
    }

    const convertRelativeFormType = () => {
        const timesplit = state.selectedFilterOption.granularity.split('.')[2];
        const convertPositive = Math.abs(state.selectedFilterOption.from);
        const gDCUnit = timesplit === "date" ? "day" : timesplit;
        let granularityNumber = "";
        if (state.selectedFilterOption.from === state.selectedFilterOption.to ) {
            if(state.selectedFilterOption.from === 0) {
                return "Today";
            } else if (state.selectedFilterOption.from === 1) {
                return "Tomorrow";
            } else if (state.selectedFilterOption.from === -1) {
                return "Yesterday";
            } else if (state.selectedFilterOption.from < -1) {
                return state.selectedFilterOption.from + " " + timesplit + " ago";
            } else {
                return state.selectedFilterOption.from + " " + timesplit + " ahead";
            }
        }else if (state.selectedFilterOption.from !== state.selectedFilterOption.to) {
            if(state.selectedFilterOption.from === 0) {
                return "Next " + (state.selectedFilterOption.to + 1) + " " + gDCUnit + "s";
            } else if (state.selectedFilterOption.to === 0) {
                return "Last " + Math.abs(state.selectedFilterOption.from - 1) + " " + gDCUnit + "s";
            } else {
                granularityNumber = convertPositive > 1 ? convertPositive + " " + gDCUnit +"s" : convertPositive + " " + gDCUnit;
                return "From " + granularityNumber + " ago to " + granularityNumber + " ahead";
            }
        }
    }
    
    return (
        <Page>
            <div id="title" className={styles.titleSection}>My Dashboard {displayDashboardTitle(state.selectedFilterOption.type)}</div>
            <div id="filterSection" className={styles.filterSection}>
                <DateFilter
                    excludeCurrentPeriod={state.excludeCurrentPeriod}
                    selectedFilterOption={state.selectedFilterOption}
                    filterOptions={defaultDateFilterOptions}
                    availableGranularities={availableGranularities}
                    customFilterName="Selected date range"
                    dateFilterMode="active"
                    onApply={onApply}
                />
            </div>
            <div className={styles.dataSection}>
                <div className={styles.chartSection}>
                    <LineChart
                        measures={measures}
                        trendBy={Md.DateMonth.Short}
                        filters={dateFilter ? [dateFilter] : []}
                    />
                </div>
                <div className={styles.calculationSection}> 
                    <Calculator filter = {dateFilter ? dateFilter : {}}/>
                </div>
            </div>
        </Page>
    );
};


export default Home;

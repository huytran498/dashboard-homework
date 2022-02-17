import React from "react";
import { shallow } from "enzyme";
import { Calculator } from "../../components/CustomComponents/Calculator";
import Home from "../Home";
import { DateFilter } from "@gooddata/sdk-ui-filters";
import { LineChart } from "@gooddata/sdk-ui-charts";
import { iteratee } from "lodash";

describe("Home page render correctly", () => {

    it("div contain title should have My Title + Filter Value", () => {
        const wrapper = shallow(<Home />);
        const defaultValue = wrapper.find('div#title').getElement().props.children.length;
        expect(defaultValue).toEqual(2);
    })

    it("Home page should contain component Date Filter, Line Chart, Custom Component", () => {
        const wrapper = shallow(<Home />);
        expect(wrapper.exists(LineChart)).toEqual(true)
        expect(wrapper.exists(Calculator)).toEqual(true)
        expect(wrapper.exists(DateFilter)).toEqual(true)
    });

    it("Default selected filter should be type allTime", () => {
        const wrapper = shallow(<Home />);
        const defaultValue = wrapper.find(DateFilter).getElement().props.selectedFilterOption.type;
        expect(defaultValue).toEqual('allTime')
    });

    it("Measures array for line chart should have length > 0", () => {
        const wrapper = shallow(<Home />);
        const defaultValue = wrapper.find(LineChart).getElement().props.measures.length > 0;
        expect(defaultValue).toEqual(true)
    });
})
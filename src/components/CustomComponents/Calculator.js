import React, {useState} from "react";
import { useExecutionDataView  } from "@gooddata/sdk-ui";
import * as Md from "../../md/full";
import { modifyMeasure, modifyAttribute, newRelativeDateFilter } from "@gooddata/sdk-model";
import Select from 'react-select';
import styles from './Calculator.module.scss';

const clothingRevenue = modifyMeasure(Md.RevenueClothing, (cr) => cr.format("#,##0").title("Clothing Revenue"));
const electronicRevenue = modifyMeasure(Md.RevenueElectronic, (er) => er.format("#,##0").title("Electronic Revenue"));
const monthDate = modifyAttribute(Md.DateDatasets.Date.Month.Short, (a) => a.alias("Month"));
const seriesBy = [clothingRevenue, electronicRevenue];
const slicesBy = [monthDate];
const sortBy = [];
let filters = [];

const options = [
    { value: 'max', label: 'Max Revenue' },
    { value: 'min', label: 'Min Revenue' },
];

export const UseDataViewComponent = (filter) => {
    const [selectedOption, setSelectedOption] = useState(null);
    
    const filterAttribute = filter && Object.keys(filter).length > 0 ? filter.filter.relativeDateFilter : {};
    if(filterAttribute){
        filters =[newRelativeDateFilter(filterAttribute.dataSet.identifier, filterAttribute.granularity, filterAttribute.from, filterAttribute.to)]
    }
    const { result, error, status } = useExecutionDataView({ execution: { seriesBy, slicesBy, sortBy, filters} });

    let arr = [];
    let calResult = 0; 
    if(!error && result && result.dataView && result.dataView.data.length > 0){
        for( let pRevenue of result.dataView.data){
            arr.push(...pRevenue)
        }
        let intArr = arr.map(x => parseInt(x));
        if(selectedOption && selectedOption.value == "max"){
            calResult = Math.max(...intArr)
        } else {
            calResult = Math.min(...intArr)
        }
    }
    
    return (
        <div className={styles.calculatorSection}>
            {selectedOption && !error ?
                <div className={styles.resultSection}>
                    ${ selectedOption.value ? calResult : 0}
                </div>
            :
                <div className={styles.resultSection}>
                    NaN
                </div>
            }
            
            <div className={styles.dropdownSection}>
                <Select
                    defaultValue={selectedOption}
                    onChange={setSelectedOption}
                    options={options}
                    placeholder="Calculation Selector"
                />
            </div>
            
        </div>
    )
}
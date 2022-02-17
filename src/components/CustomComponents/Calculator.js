import React, {useState} from "react";
import { useExecutionDataView  } from "@gooddata/sdk-ui";
import * as Md from "../../md/full";
import { modifyMeasure, modifyAttribute, newRelativeDateFilter } from "@gooddata/sdk-model";
import Select from 'react-select';
import styles from './Calculator.module.scss';

const productRevenue = modifyMeasure(Md.Revenue, (cr) => cr.format("#,##0").title("Product Revenue"));
const monthDate = modifyAttribute(Md.DateDatasets.Date.Month.Short, (a) => a.alias("Month"));
const seriesBy = [productRevenue];
const slicesBy = [monthDate];
const sortBy = [];
let filters = [];

const options = [
    { value: 'max', label: 'Max Revenue' },
    { value: 'min', label: 'Min Revenue' },
];

export const UseDataViewComponent = (filter) => {
    const [selectedOption, setSelectedOption] = useState({ value: 'max', label: 'Max Revenue' });
    
    //Check filter object exists & have data
    const filterAttribute = filter && Object.keys(filter).length > 0 ? filter.filter.relativeDateFilter : {};
    if(filterAttribute){
        filters =[newRelativeDateFilter(filterAttribute.dataSet.identifier, filterAttribute.granularity, filterAttribute.from, filterAttribute.to)]
    }
    const { result, error, status } = useExecutionDataView({ execution: { seriesBy, slicesBy, sortBy, filters} });

    let calResult = 0; 
    //Filter calculation value from dataset
    if(result){
        const intArr = result.dataView.data.flat().map(value => Math.round(value));
        calResult = Math[selectedOption.value](...intArr);
    }
    
    return (
        <div className={styles.calculatorSection}>
            {result ?
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

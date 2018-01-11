import * as React from "react";
import * as moment from "moment";
import {SearchkitComponent} from "searchkit"

const RcCalendar = require("rc-calendar")
const RangeCalendar = require('rc-calendar/lib/RangeCalendar');
const enUS = require('rc-calendar').enUS;
const DatePicker = require('rc-calendar/lib/Picker');

const format = 'dddd D. MMMM YYYY';
const fullFormat = 'ddd D.M.Y';

export class Picker extends SearchkitComponent<any, any> {
  render() {
    const props = this.props;
    const { showValue } = props;
    const calendar = (
      <RangeCalendar
        type={this.props.type}
        locale={enUS}
        format={format}
        onChange={props.onChange}
        disabledDate={props.disabledDate}
        showToday={true}
        showOk={false}
        showClear={false}
      />);

    return (
      <DatePicker
        prefixCls="sk-calendar-picker"
        open={this.props.open}
        onOpenChange={this.props.onOpenChange}
        calendar={calendar}
        value={props.value}
        dateFormat={format}
        align={{
          points: ['bl', 'tl']
        }}
      >
        {
          () => (
            <div className="sk-date-box">
              <div className="sk-date-box__value" style={{flex:"1 0 50%"}}>
                {(showValue && moment(showValue).format(fullFormat)) || props.dateInputPlaceholder}
              </div>
            </div>
          )
        }
      </DatePicker>);
  }
};


export class DateRangeCalendar extends SearchkitComponent<any, any> {
    constructor(props) {
    super(props)
    const { fromDate, toDate } = props
    this.state = {
      startOpen: false,
      endOpen: false,
    }
  }

  componentWillReceiveProps(nextProps){
    const { fromDate, toDate } = nextProps;
    this.handleChange([fromDate, toDate])
  }

  onStartOpenChange = (startOpen) => {
    this.setState({
      startOpen,
    });
  }

  onEndOpenChange = (endOpen) => {
    this.setState({
      endOpen,
    });
  }

  onStartChange = (value) => {
    this.setState({
      startValue: value[0],
      startOpen: false,
      endOpen: false,
    });
    this.handleChange(value)
  }

  onEndChange = (value) => {
    this.handleChange(value)
  }

  clearState = () => {
    const { onFinished } = this.props
    this.setState({
      startValue: null,
      endValue: null,
    })
    onFinished({
      fromDate: null,
      toDate: null
    })
  }

  // For disabling past dates
  disabledPastDate = (endValue) => {
    if (endValue.diff(moment(), 'days') < 0) {
      return true
    }
    return false
  }

  disabledStartDate = (endValue) => {
    if (!endValue) {
      return false;
    }
    const startValue = this.state.startValue;
    if (!startValue) {
      return false;
    }
    return endValue.diff(startValue, 'days') < 0;
  }

  handleChange = (value) => {
    const startValue = value[0]
    const endValue = value[1]
    const notToday = startValue > +moment().endOf("day")
                  || startValue < +moment().startOf("day");
      const newState = {
          fromDate: notToday && startValue.startOf("day") || startValue,
          toDate: endValue && endValue.endOf("day")
      };
    this.setState(newState);
  }

    handleDateFinished = (event) => {
        const { onFinished } = this.props
        const newState = {
            fromDate: this.state.fromDate,
            toDate: this.state.toDate
        };
        onFinished(newState)
    }

    render() {
    const state = this.state;
    const { fromDate, toDate } = this.props

    const fromLabel = "From";
    const toLabel = "To";

    return (
      <div>
        <Picker
          onOpenChange={this.onStartOpenChange}
          open={this.state.startOpen}
          type="start"
          showValue={state.fromDate || fromDate}
          value={[state.fromDate || fromDate, state.toDate ||toDate]}
          onChange={this.onStartChange}
          dateInputPlaceholder={fromLabel}
        />
        <Picker
          onOpenChange={this.onEndOpenChange}
          open={this.state.endOpen}
          type="end"
          showValue={state.toDate || toDate}
          disabledDate={this.disabledStartDate}
          value={[state.fromDate || fromDate, state.toDate ||toDate]}
          onChange={this.onEndChange}
          dateInputPlaceholder={toLabel}
        />
        <button id="date-submit" onClick={this.handleDateFinished}>Go</button>
      </div>
    )
  }
}


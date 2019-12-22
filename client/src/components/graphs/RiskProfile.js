import React from "react";
import { render } from "react-dom";
import HighchartsReact from "highcharts-react-official";
// Import Highcharts
import Highcharts from "highcharts/highcharts.src.js";
// Import Action creator and dispatch
import { getGraphData } from "../../actions/graphsAction";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class RiskProfile extends React.PureComponent {
  state = {
    currentData: [],
    expiryData: [],
    pricesData: [],
    x: "",
    chartOptions: {
      series: [
        {
          name: "Now",
          data: []
        },
        {
          name: "Expiry",
          color: "green",
          data: []
        }
      ],
      chart: {
        backgroundColor: "#1f2531",
        type: "line"
      },
      credits: {
        enabled: false
      },
      title: {
        text: "Risk Profile Graph",
        align: "center",
        fontFamily: "Lucida Grande",
        x: 70,
        style: {
          color: "#fff"
        }
      },
      yAxis: {
        title: {
          enabled: true,
          text: "Prices",
          style: {
            fontWeight: "normal",
            color: "#fff"
          }
        },
        labels: {
          style: {
            color: "#fff"
          }
        }
      },
      xAxis: {
        labels: {
          style: {
            color: "#fff"
          }
        },

        categories: []
      }
    }
  };

  afterChartCreated = chart => {
    this.internalChart = chart;
    this.forceUpdate();
  };

  componentDidUpdate() {
    // this.internalChart.getMargins(); // redraw
    this.internalChart.reflow();

    this.setState({
      currentData: this.props.graphValues.graphValues.current_payoff,
      expiryData: this.props.graphValues.graphValues.expiry_payoff,
      pricesData: this.props.graphValues.graphValues.underlying_price
      // chartOptions.series[1].data:
    });

    // console.log(this.state.graphData);
    // console.log(this.props.graphValues.graphValues);

    // Updating Now Data Frame
    if (
      typeof this.state.currentData !== "undefined" &&
      this.state.currentData.length > 0
    ) {
      this.state.currentData.map(data => {
        this.state.chartOptions.series[0].data.push(data);
      });
      // this.state.chartOptions.series[1].data.push(this.props.graphValues.graphValues.expiry_payoff);
    }

    // Updating Expiry Data Frame
    if (
      typeof this.state.expiryData !== "undefined" &&
      this.state.expiryData.length > 0
    ) {
      this.state.expiryData.map(data => {
        this.state.chartOptions.series[1].data.push(data);
      });
      // this.state.chartOptions.series[1].data.push(this.props.graphValues.graphValues.expiry_payoff);
    }

    // Updating Prices Data Frame
    if (
      typeof this.state.pricesData !== "undefined" &&
      this.state.pricesData.length > 0
    ) {
      this.state.pricesData.map(data => {
        this.state.chartOptions.xAxis.categories.push(data);
      });

      // this.state.chartOptions.series[1].data.push(this.props.graphValues.graphValues.expiry_payoff);
      // }
      // if (this.props){
      //   let nowCopy = JSON.parse(JSON.stringify(this.state.chartOptions))
      //   nowCopy.xAxis.categories = this.props.graphValues.graphValues.current_payoff
      //   this.setState({
      //     chartOptions: nowCopy
      //   })
      // console.log('NOW', nowCopy)
    }
    console.log(this.state);
  }
  componentDidMount() {
    // this.state.chartOptions.series[1].data.push(this.props.graphValues.graphValues.expiry_payoff);
    // this.forceUpdate()
  }

  render() {
    const chart = this.internalChart,
      customLabels = [];

    const chartOptions = {
      legend: {
      itemStyle: {
          color: '#828a98',
          fontWeight: 'bold'
      }
  },
      series: [
        {
          name: "Now",
          data: this.state.currentData
        },
        {
          name: "Expiry",
          color: "green",
          labelFormat: {
            style:{
              color: "#fff"
            }
          },
          data: this.state.expiryData
        }
      ],
      chart: {
        backgroundColor: "#1f2531",
        type: "line"
      },
      credits: {
        enabled: false
      },
      title: {
        text: "Risk Profile Graph",
        align: "center",
        fontFamily: "Lucida Grande",
        x: 70,
        style: {
          color: "#fff"
        }
      },
      yAxis: {
        title: {
          enabled: true,
          text: "Prices",
          style: {
            fontWeight: "normal",
            color: "#fff"
          }
        },
        labels: {
          style: {
            color: "#fff"
          }
        }
      },
      xAxis: {
        labels: {
          style: {
            color: "#fff"
          }
        },



        categories: this.state.pricesData
      }
    };

    return (
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          callback={this.afterChartCreated}
        />
        {customLabels}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  graphValues: state.graphValues
});

export default connect(
  mapStateToProps,
  { getGraphData }
)(withRouter(RiskProfile));

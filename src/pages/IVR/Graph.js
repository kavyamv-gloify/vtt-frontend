import * as React from 'react';
import Paper from '@mui/material/Paper';
import {
  Chart,
  AreaSeries,
  BarSeries,
  SplineSeries,
  ScatterSeries,
  ArgumentAxis,
  ValueAxis,
  Title,
  Legend,
  Tooltip,
} from '@devexpress/dx-react-chart-material-ui';
import {
  ValueScale,
  Stack,
  Animation,
  EventTracker,
  HoverState,
} from '@devexpress/dx-react-chart';
import {connectProps} from '@devexpress/dx-react-core';
import {format} from 'd3-format';

// import { oilProduction } from '../../../demo-data/data-vizualization';
const oilProduction = [
  {
    year: '1970',
    saudiArabia: 241.142,
    usa: 482.15,
    iran: 230.174,
    mexico: 23.64,
    price: 17,
    consumption: '',
  },
  {
    year: '1980',
    saudiArabia: 511.334,
    usa: 437.343,
    iran: 75.097,
    mexico: 108.249,
    price: 104,
    consumption: '',
  },
  {
    year: '1990',
    saudiArabia: 324.359,
    usa: 374.867,
    iran: 165.284,
    mexico: 141.06,
    russia: 516.04,
    price: 23.7,
    consumption: '',
  },
  {
    year: '2000',
    saudiArabia: 410.06,
    usa: 297.513,
    iran: 196.877,
    mexico: 159.63,
    russia: 312.821,
    price: 28.3,
    consumption: '',
  },
  {
    year: '2010',
    saudiArabia: 413.505,
    usa: 279.225,
    iran: 200.318,
    mexico: 144.975,
    russia: 487.106,
    price: 79.6,
    consumption: '',
  },
  {
    year: '2015',
    saudiArabia: 516.157,
    usa: 437.966,
    iran: 142.087,
    mexico: 121.587,
    russia: 512.777,
    price: 52.4,
    consumption: '',
  },
];
const consumptionSeriesName = '';
const consumptionColor = 'white';
const priceColor = '#fcd45a';

const makeLabel =
  (symbol, color) =>
  ({text, style, ...restProps}) =>
    (
      <ValueAxis.Label
        text={`${text} ${symbol}`}
        style={{
          fill: color,
          ...style,
        }}
        {...restProps}
      />
    );
const PriceLabel = makeLabel('$', priceColor);
const LabelWithThousand = makeLabel('k', consumptionColor);

const patchProps = ({hoverIndex, ...props}) => ({
  state: props.index === hoverIndex ? 'hovered' : null,
  ...props,
});

const BarPoint = (props) => <BarSeries.Point {...patchProps(props)} />;

const pointOptions = {size: 7};
const getPointOptions = (state) => (state ? {size: 7} : {size: 0});

const AreaPoint = (props) => {
  const patched = patchProps(props);
  return (
    <ScatterSeries.Point point={getPointOptions(patched.state)} {...patched} />
  );
};

const AreaWithPoints = ({state, ...props}) => (
  <React.Fragment>
    {/* <AreaSeries.Path {...props} />
    <ScatterSeries.Path {...props} /> */}
  </React.Fragment>
);

const SplinePoint = (props) => (
  <ScatterSeries.Point point={pointOptions} {...patchProps(props)} />
);

const SplineWithPoints = (props) => (
  <React.Fragment>
    <SplineSeries.Path {...props} />
    <ScatterSeries.Path {...props} />
  </React.Fragment>
);

const series = [
  {name: 'Delivered', key: 'usa', color: '#08abbd'},
  {name: 'Undeliverable', key: 'saudiArabia', color: '#78bc97'},
  {name: 'Waiting for delivery', key: 'mexico', color: '#9ccc65'},
  {
    name: 'Callings',
    key: 'price',
    color: priceColor,
    scale: 'price',
    type: SplineSeries,
  },
  {
    name: consumptionSeriesName,
    key: 'consumption',
    color: consumptionColor,
    type: AreaSeries,
  },
];

const legendRootStyle = {
  display: 'flex',
  margin: 'auto',
  flexDirection: 'row',
};
const LegendRoot = (props) => (
  <Legend.Root {...props} style={legendRootStyle} />
);

const legendItemStyle = {
  flexDirection: 'column',
  marginLeft: '-2px',
  marginRight: '-2px',
};
const LegendItem = (props) => (
  <Legend.Item {...props} style={legendItemStyle} />
);

const legendLabelStyle = {
  whiteSpace: 'nowrap',
};
const LegendLabel = (props) => (
  <Legend.Label {...props} style={legendLabelStyle} />
);

const formatTooltip = format('.1f');
const TooltipContent = ({data, text, style, ...props}) => {
  const alignStyle = {
    ...style,
    paddingLeft: '10px',
  };
  const items = series.map(({name, key, color}) => {
    const val = data[key];
    if (!name) return;
    return (
      <tr key={key}>
        <td>
          <svg width='10' height='10'>
            <circle cx='5' cy='5' r='5' fill={color} />
          </svg>
        </td>
        <td>
          <Tooltip.Content style={alignStyle} text={name} {...props} />
        </td>
        <td align='right'>
          <Tooltip.Content
            style={alignStyle}
            text={val ? formatTooltip(val) : 'N/A'}
            {...props}
          />
        </td>
      </tr>
    );
  });
  return <table>{items}</table>;
};

const stacks = [
  {series: series.filter((obj) => !obj.type).map((obj) => obj.name)},
];

const modifyOilDomain = (domain) => [domain[0], 2200];
const modifyPriceDomain = () => [0, 110];
const getHoverIndex = ({target}) => (target ? target.point : -1);
export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: oilProduction,
      target: null,
    };

    this.changeHover = (target) =>
      this.setState({
        target: target
          ? {series: consumptionSeriesName, point: target.point}
          : null,
      });

    this.createComponents();
    this.createSeries();
  }

  componentDidUpdate(prevProps, prevState) {
    if (getHoverIndex(prevState) !== getHoverIndex(this.state)) {
      this.BarPoint.update();
      this.SplinePoint.update();
      this.AreaPoint.update();
      this.TooltipContent.update();
    }
  }

  createComponents() {
    const getHoverProps = () => ({
      hoverIndex: getHoverIndex(this.state),
    });
    this.BarPoint = connectProps(BarPoint, getHoverProps);
    this.SplinePoint = connectProps(SplinePoint, getHoverProps);
    this.AreaPoint = connectProps(AreaPoint, getHoverProps);

    this.TooltipContent = connectProps(TooltipContent, () => {
      const {data, target} = this.state;
      return {data: target ? data[target.point] : null};
    });
  }

  createSeries() {
    this.series = series.map(({name, key, color, type, scale}) => {
      const props = {
        key: name,
        name,
        valueField: key,
        argumentField: 'year',
        color,
        scaleName: scale || 'oil',
        pointComponent: this.BarPoint,
      };
      if (type === AreaSeries) {
        props.seriesComponent = AreaWithPoints;
        props.pointComponent = this.AreaPoint;
      } else if (type) {
        props.seriesComponent = SplineWithPoints;
        props.pointComponent = this.SplinePoint;
      }
      return React.createElement(type || BarSeries, props);
    });
  }

  render() {
    const {data, target} = this.state;

    return (
      <Paper>
        <Chart data={data}>
          <ValueScale name='oil' modifyDomain={modifyOilDomain} />
          <ValueScale name='price' modifyDomain={modifyPriceDomain} />

          <ArgumentAxis />
          <ValueAxis scaleName='oil' labelComponent={LabelWithThousand} />
          <ValueAxis
            scaleName='price'
            position='right'
            labelComponent={PriceLabel}
          />
          {this.series}
          <Animation />
          <Legend
            position='bottom'
            rootComponent={LegendRoot}
            itemComponent={LegendItem}
            labelComponent={LegendLabel}
          />
          <Stack stacks={stacks} />
          <EventTracker />
          <HoverState hover={target} onHoverChange={this.changeHover} />
          <Tooltip targetItem={target} contentComponent={this.TooltipContent} />
        </Chart>
      </Paper>
    );
  }
}

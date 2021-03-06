'use strict';
var React = require('react'),
    connect = require('react-redux').connect,
    ContentEditable = require('../ContentEditable'),
    DataTable = require('./DataTable'),
    selectPipeline = require('../../actions/selectPipeline'),
    getIn = require('../../util/immutable-utils').getIn,
    assets = require('../../util/assets'),
    Icon = require('../Icon');

function mapStateToProps(state, ownProps) {
  return {
    isSelected: getIn(state, 'inspector.pipelines.selected') === ownProps.pipeline._id
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectPipeline: function(id) {
      dispatch(selectPipeline(id));
    }
  };
}

var PipelineInspector = React.createClass({
  propTypes: {
    isSelected: React.PropTypes.bool,
    selectPipeline: React.PropTypes.func
  },

  render: function() {
    var props = this.props,
        pipeline = props.pipeline,
        inner = (<span></span>);

    function updatePipelineName(val) {
      pipeline.name = val;
    }

    if (props.isSelected) {
      inner = (
        <div className="inner">
          <p className="source"><Icon glyph={assets.database} width="11" height="11" /> {pipeline._source.name}</p>
          <DataTable dataset={pipeline._source} className="source" />
        </div>
      );
    }

    return (
      <div className={'pipeline' + (props.isSelected ? ' selected' : '')}>
        <ContentEditable className="header"
          value={pipeline.name}
          save={updatePipelineName}
          onClick={props.selectPipeline.bind(null, pipeline._id)} />
        {inner}
      </div>
    );
  }
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(PipelineInspector);

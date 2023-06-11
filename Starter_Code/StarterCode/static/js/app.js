// Load the data from samples.json
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
  // Log the loaded data to the console
  console.log(data);

  // Get a reference to the dropdown menu element
  var dropdown = d3.select("#selDataset");

  // Populate the dropdown menu with test subject IDs
  data.names.forEach(function(name) {
    dropdown.append("option").text(name).property("value", name);
  });

  // Set the default test subject ID to the first in the list
  var defaultId = data.names[0];

  // Call the update functions to generate initial charts
  updateDemographicInfo(defaultId, data);
  updateBarChart(defaultId, data);
  updateBubbleChart(defaultId, data);

  // Define the optionChanged function to update the charts when a new test subject is selected
  function optionChanged(id) {
    // Call the update functions to generate new charts with the selected test subject data
    updateDemographicInfo(id, data);
    updateBarChart(id, data);
    updateBubbleChart(id, data);
  }

  // Add an event listener to the dropdown menu to call the optionChanged function when a new test subject is selected
  dropdown.on("change", function() {
    var newId = d3.select(this).property("value");
    optionChanged(newId);
  });
});

// Define a function to update demographic info based on a selected test subject
function updateDemographicInfo(id, data) {
  // Find the metadata object for the selected test subject
  var metadata = data.metadata.find(function(m) {
    return m.id.toString() === id.toString();
  });

  // Get a reference to the sample metadata element
  var sampleMetadata = d3.select("#sample-metadata");

  // Clear any existing metadata
  sampleMetadata.html("");

  // Populate the sample metadata with demographic info for the selected test subject
  Object.entries(metadata).forEach(function([key, value]) {
    sampleMetadata.append("p").text(`${key}: ${value}`);
  });
}

// Define a function to update the bubble chart with the sample data for a selected test subject
function updateBubbleChart(id, data) {
  // Find the sample object for the selected test subject
  var sample = data.samples.find(function(s) {
    return s.id === id;
  });

  // Create a trace for the bubble chart
  var trace = {
    x: sample.otu_ids,
    y: sample.sample_values,
    text: sample.otu_labels,
    mode: "markers",
    marker: {
      size: sample.sample_values,
      color: sample.otu_ids,
      colorscale: "Earth"
    }
  };

  // Create a data array with the trace
  var data = [trace];

  // Define the layout for the chart
  var layout = {
    title: "OTU Bubble Chart for Test Subject " + id,
    xaxis: { title: "OTU ID" },
  };

  // Plot the chart using Plotly.js
  Plotly.newPlot("bubble", data, layout);
}

// Define a function to update the bar chart with the sample data for a selected test subject
function updateBarChart(id, data) {
  // Find the sample object for the selected test subject
  var sample = data.samples.find(function(s) {
    return s.id === id;
  });

  // Sort the OTUs by descending sample value
  var sortedOtuIds = sample.otu_ids.slice().sort((a, b) => sample.sample_values[b] - sample.sample_values[a]);
  var sortedSampleValues = sample.sample_values.slice().sort((a, b) => b - a);
  var sortedOtuLabels = sortedOtuIds.map(function(id) {
    return sample.otu_labels[sample.otu_ids.indexOf(id)];
  });

  // Take the top 10 OTUs and reverse the order to display them in descending order
  var topOtuIds = sortedOtuIds.slice(0, 10).reverse();
  var topSampleValues = sortedSampleValues.slice(0, 10).reverse();
  var topOtuLabels = sortedOtuLabels.slice(0, 10).reverse();

    // Create a trace for the bar chart
    var trace = {
        x: topSampleValues,
        y: topOtuIds.map(function(id) {
          return `OTU ${id}`;
        }),
        text: topOtuLabels,
        type: "bar",
        orientation: "h"
      };
    
      // Create a data array with the trace
      var data = [trace];
    
      // Define the layout for the chart
      var layout = {
        title: "OTU Bar Chart for Test Subject " + id,
      };
    
      // Plot the chart using Plotly.js
      Plotly.newPlot("bar", data, layout);
    }; // <-- missing curly brace
    

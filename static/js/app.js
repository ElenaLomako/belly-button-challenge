// Define endpoint URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch data and perform actions
d3.json(url).then(function(data) {
    // Log the retrieved data to the console
    // console.log("Fetched Data:", data);

    // Initialize charts with first item
    nameOptions(data);
    updateCharts(data, data.names[0]);

    // Update charts when a new item is selected from the dropdown
    d3.selectAll("#selDataset").on("change", function() {
        let selectedValue = d3.select(this).property("value");
        updateCharts(data, selectedValue);
    });
});

// Function to add data to the dropdown menu
function nameOptions(data) {
    // Select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");
    
    // Get the array of names from the data
    let names = data.names;

    // Clear existing dropdown options
    dropdownMenu.html("");

    // Add each name as an option in the dropdown
    names.forEach(name => {
        dropdownMenu
            .append("option")
            .text(name)
            .attr("value", name);
    });

    // Log the names to the console
    // console.log("Dropdown Names:", names);
}

// Function to update charts based on the selected item
function updateCharts(data, identifier) {
    // Call functions to update each chart
    barChart(data, identifier);
    bubbleChart(data, identifier);
    metaData(data, identifier);
}

// Function to create bar chart
function barChart(data, identifier) {
    // Find the sample data for the selected identifier
    let sampleData = data.samples.find(sample => sample.id === identifier);

    // Log the sample data to the console
    // console.log("Bar Chart Data:", sampleData);

    // Define the trace for the bar chart
    let trace = {
        x: sampleData.sample_values.slice(0, 10).reverse(),
        y: sampleData.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`),
        type: "bar",
        orientation: "h"
    };

    // Define layout for the bar chart
    let layout = {
        title: `Top 10 OTUs for ${identifier}`,
        yaxis: { title: "OTU ID" },
        xaxis: { title: "Sample Value" }
    };

    // Create the bar chart
    let plotData = [trace];
    Plotly.newPlot('bar', plotData, layout);
}

// Function to create bubble chart
function bubbleChart(data, identifier) {
    // Find the sample data for the selected identifier
    let sampleData = data.samples.find(sample => sample.id === identifier);

    // Log the sample data to the console
    // console.log("Bubble Chart Data:", sampleData);

    // Define the trace for the bubble chart
    let trace = {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        mode: "markers",
        marker: {
            size: sampleData.sample_values,
            color: sampleData.otu_ids,
            colorscale: 'Earth'
        }
    };

    // Define layout for the bubble chart
    let layout = {
        title: `OTU IDs vs. Sample Values for ${identifier}`,
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Value" }
    };

    // Create the bubble chart
    let plotData = [trace];
    Plotly.newPlot('bubble', plotData, layout);
}

// Function to update metadata panel
function metaData(data, identifier) {
    // Find the metadata for the selected identifier
    let info = data.metadata.find(sample => `${sample.id}` === identifier);

    // Log the metadata to the console
    // console.log("Metadata:", info);

    // Select the metadata panel
    let metadataPanel = d3.select("#sample-metadata");

    // Clear existing metadata
    metadataPanel.html("");

    // Add each key-value pair as a paragraph in the metadata panel
    Object.entries(info).forEach(([key, value]) => {
        metadataPanel.append("p").text(`${key}: ${value}`);
    });
}

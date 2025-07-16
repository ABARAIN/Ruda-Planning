const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '16px',
        fontFamily: 'Arial, sans-serif'
    },
    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '24px',
        color: '#333'
    },
    row: {
        display: 'grid',
        gap: '16px',
        marginBottom: '24px'
    },
    firstRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
    },
    secondRow: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '16px',
        marginBottom: '24px'
    },
    thirdRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
    },
    fourthRow: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '16px'
    },
    card: {
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        height: 'fit-content', /* Makes sure cards have adjustable height */
        maxHeight: '400px', /* Add a max height */
        overflow: 'hidden', /* Prevent content overflow */
        display: 'flex',
        flexDirection: 'column', /* Make sure content stacks vertically */
    },

    cardTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '12px',
        textAlign: 'center',
        backgroundColor: '#333',
        color: 'white',
        padding: '8px',
        borderRadius: '4px',
        textOverflow: 'ellipsis', /* Handle text overflow */
        whiteSpace: 'nowrap', /* Prevent text from wrapping */
        overflow: 'hidden', /* Hide overflowing text */
    },






    masterPlan: {
        height: '192px', /* Set the height of the master plan container */
        backgroundColor: '#e5e7eb', /* Background color if image is not loaded */
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', /* Prevent image from overflowing */
        position: 'relative', /* Positioning context for absolute positioning */
    },

    img: {
        width: '100%', /* Make the image take up the entire container width */
        height: '100%', /* Make the image take up the entire container height */
        objectFit: 'cover', /* Ensures the image covers the container without distortion */
        borderRadius: '8px', /* Match the border radius of the container */
    }
    ,








    chartContainer: {
        display: 'flex',
        justifyContent: 'flex-start',  // Align chart to the left
        alignItems: 'center',
        width: '100%',  // Full width of the container
        height: '300px',  // Adjust the height of the chart as necessary
        marginLeft: '-30px',  // Shift the chart slightly to the left
    },

    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        height: 'auto', /* Ensure the height is flexible and adjusts to the content */
        overflow: 'hidden', /* Prevent content overflow */
    },
    metricCard: {
        backgroundColor: 'white',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%', /* Make the card flexible and adjust height */
        maxHeight: '150px', /* Set a max height to avoid overflow */
        overflow: 'hidden', /* Hide content that overflows */
        textAlign: 'center', /* Center text horizontally */
    },
    metricIcon: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '8px',
        borderRadius: '50%',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    metricValue: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#3b82f6',
        marginBottom: '4px',
        overflow: 'hidden', /* Prevent text overflow */
        textOverflow: 'ellipsis', /* Add ellipsis if the text is too long */
        whiteSpace: 'nowrap', /* Prevent wrapping text */
    },
    metricTitle: {
        fontSize: '12px',
        color: '#6b7280',
        textAlign: 'center'
    },
    timelineContainer: {
        padding: '16px'
    },
    timelineDuration: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '12px'
    },
    durationLabel: {
        fontSize: '14px',
        fontWeight: '500'
    },
    durationChips: {
        display: 'flex',
        gap: '8px'
    },
    chip: {
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        color: 'white'
    },
    chipGreen: {
        backgroundColor: '#10b981'
    },
    chipBlue: {
        backgroundColor: '#3b82f6'
    },
    timelineYears: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        marginBottom: '8px'
    },
    timelineBar: {
        display: 'flex',
        gap: '4px',
        marginBottom: '12px',
        overflow: 'hidden', /* Prevent content from overflowing */
    },

    timelineElapsed: {
        backgroundColor: '#10b981',
        height: '16px',
        flex: 1,
        borderRadius: '4px'
    },
    timelineRemaining: {
        backgroundColor: '#3b82f6',
        height: '16px',
        flex: 2.5,
        borderRadius: '4px'
    },
    timelineLegend: {
        display: 'flex',
        justifyContent: 'center', /* Center the legend items horizontally */
        gap: '16px',
        alignItems: 'center', /* Center items vertically */
        marginTop: '12px', /* Space between legend and other content */
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    legendColor: {
        width: '12px',
        height: '12px',
        borderRadius: '2px'
    },
    legendText: {
        fontSize: '12px'
    }, progressContainer: {
        display: 'flex',
        flexDirection: 'row', /* Arrange progress cards horizontally */
        justifyContent: 'center', /* Center progress cards horizontally */
        alignItems: 'center', /* Center progress cards vertically */
        height: 'auto', /* Allow height to adjust based on content */
        gap: '16px', /* Space between progress cards */
        overflow: 'hidden', /* Prevent overflow */
    },










    progressCard: {
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', /* Center the contents horizontally */
        justifyContent: 'center', /* Ensure that content is centered vertically */
        height: 'fit-content', /* Adjust height to fit content */
        maxWidth: '200px', /* Set max width to ensure cards don’t stretch too wide */
        overflow: 'hidden', /* Prevent content overflow */
        textAlign: 'center', /* Center text horizontally */
    },
    progressCircle: {
        width: '64px', /* Set width */
        height: '64px', /* Set height */
        borderRadius: '50%',
        border: '4px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '8px', /* Add some space between the circle and text */
        position: 'relative', /* Positioning context for inner circle */
        margin: '0 auto', /* Center the circle horizontally */
    },
    progressInner: {
        backgroundColor: 'white',
        width: '48px', /* Adjust width */
        height: '48px', /* Adjust height */
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    progressText: {
        fontSize: '14px',
        fontWeight: 'bold',
    },
    progressLabel: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        overflow: 'hidden', /* Prevent text from overflowing */
        textOverflow: 'ellipsis', /* Add ellipsis for long labels */
        whiteSpace: 'nowrap', /* Prevent wrapping text */
    },







    financialGrid: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: 'auto', /* Allow the height to adjust based on content */
        gap: '16px',
        overflow: 'hidden', /* Prevent content overflow */
    },
    financialItem: {
        textAlign: 'center',
        maxHeight: '100px', /* Limit the height of financial items */
        overflow: 'hidden', /* Prevent content from overflowing */
    },
    financialValue: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: '4px',
        textOverflow: 'ellipsis', /* Add ellipsis if value is too long */
        overflow: 'hidden', /* Prevent overflow */
        whiteSpace: 'nowrap', /* Prevent text from wrapping */
    },
    financialLabel: {
        fontSize: '12px',
        color: '#6b7280',
        overflow: 'hidden', /* Prevent content overflow */
        textOverflow: 'ellipsis', /* Add ellipsis for long labels */
        whiteSpace: 'nowrap', /* Prevent wrapping text */
    },










    budgetContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: 'auto', /* Adjust based on content */
        gap: '16px',
        overflow: 'hidden', /* Prevent overflow */
    },
    budgetItem: {
        marginBottom: '16px',
        overflow: 'hidden', /* Prevent content overflow */
    },
    budgetLabel: {
        fontSize: '12px',
        marginBottom: '4px',
        textOverflow: 'ellipsis', /* Add ellipsis for long labels */
        overflow: 'hidden', /* Prevent overflow */
        whiteSpace: 'nowrap', /* Prevent wrapping text */
    },
    budgetBar: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflow: 'hidden', /* Prevent overflow */
    },
    budgetProgress: {
        flex: 1,
        backgroundColor: '#e5e7eb',
        borderRadius: '9999px',
        height: '12px',
        overflow: 'hidden', /* Prevent overflow */
    },
    budgetFill: {
        height: '12px',
        borderRadius: '9999px',
        overflow: 'hidden', /* Prevent overflow */
    },
    budgetValue: {
        fontSize: '12px',
    },

    expenditureContainer: {
        height: '128px'
    },
    expenditureLabel: {
        textAlign: 'center',
        fontSize: '12px',
        color: '#6b7280',
        marginBottom: '8px'
    },
    achievementsContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '128px'
    },
    achievementsContent: {
        textAlign: 'center',
        color: '#6b7280'
    },











    sustainabilityContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)', // 2 items per row
        gridGap: '16px', // Space between items
        padding: '16px',
        justifyItems: 'center', // Center grid items horizontally
        alignItems: 'center', // Center items vertically
        textAlign: 'center', // Center text under the icons
    },
    sustainabilityItem: {
        display: 'flex',
        flexDirection: 'row',  // Change to row layout to display icons in a line
        alignItems: 'center',  // Center items horizontally (icon and text)
        gap: '8px', /* Space between icon and text */
        marginBottom: '16px', /* Space between each sustainability item */
        overflow: 'hidden', /* Prevent content overflow */
    },

    sustainabilityIcon: {
        padding: '10px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2196f3', /* Adjust based on the icon color */
        color: 'white',
        marginBottom: '8px',  // Space between icon and text
    },
    sustainabilityText: {
        textAlign: 'center',  // Center the text under the icon
        overflow: 'hidden', /* Prevent text from overflowing */
    },
    sustainabilityTitle: {
        fontWeight: '600',
        fontSize: '12px',  // Adjusted font size
        textOverflow: 'ellipsis', /* Add ellipsis for long titles */
        whiteSpace: 'nowrap', /* Prevent wrapping text */
        overflow: 'hidden', /* Prevent overflow */
    },
    sustainabilitySubtitle: {
        fontSize: '10px',
        color: '#6b7280',
        overflow: 'hidden', /* Prevent overflow */
        textOverflow: 'ellipsis', /* Add ellipsis for long subtitles */
        whiteSpace: 'nowrap', /* Prevent wrapping text */
    },






    customLegend:
    {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '4px',
        marginTop: '8px'
    },
    legendEntry: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px'
    },
    legendDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        marginRight: '4px'
    },









    // Media queries for responsive design
    '@media (max-width: 768px)': {
        // Adjusting main container for mobile view
        sustainabilityContainer: {
            gridTemplateColumns: '1fr', // Stack items in a single column
            padding: '8px', // Reduce padding for mobile
        },
        sustainabilityItem: {
            flexDirection: 'column', // Stack items vertically (icon on top, text below)
            alignItems: 'center', // Center everything
            gap: '10px', // Space between icon and text
        },
        sustainabilityIcon: {
            fontSize: '30px', // Adjust icon size for mobile
            padding: '8px', // Reduce padding for mobile icons
        },
        sustainabilityText: {
            textAlign: 'center',  // Center the text below the icon
            overflow: 'hidden',
        },
        sustainabilityTitle: {
            fontSize: '16px',  // Increase font size slightly for titles
        },
        sustainabilitySubtitle: {
            fontSize: '14px',  // Adjust subtitle font size
        },

        // Adjust the layout of the other containers
        chartContainer: {
            display: 'flex',
            justifyContent: 'center', // Center the chart horizontally
            alignItems: 'center', // Center the chart vertically
            width: '100%', // Full width of the container
            marginTop: '16px', // Margin between chart and other elements
        },

        customLegend: {
            display: 'flex',
            justifyContent: 'center',  // Center the legend items
            gap: '16px',
            marginTop: '16px',
            padding: '8px', // Padding for the legend items
        },
        legendItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
        },
        legendColor: {
            width: '16px',
            height: '16px',
            borderRadius: '50%',  // Circle style for the legend
        },
        legendText: {
            fontSize: '14px',
            fontWeight: '500',
        },

        // Ensure the layout for all sections is adjusted for mobile
        card: {
            backgroundColor: 'white',
            padding: '12px', // Adjust padding to make it more compact
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Center content horizontally
            justifyContent: 'center', // Center content vertically
            textAlign: 'center',
            minHeight: 'auto',  // Adjust height for mobile
        },
    },

};


export default styles;
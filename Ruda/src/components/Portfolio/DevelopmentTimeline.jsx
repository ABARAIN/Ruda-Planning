import React from 'react';
import { Container, Row, Col } from 'reactstrap'; // For layout
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Recharts

const DevelopmentTimeline = () => {
  // Time data for the timeline (in years)
  const elapsedTime = 4.5; // Time elapsed
  const remainingTime = 11.5; // Time remaining

  // Calculate the total duration
  const totalTime = elapsedTime + remainingTime;

  // Calculate the progress value (percentage of time elapsed)
  const elapsedProgress = (elapsedTime / totalTime) * 100; // Percentage of elapsed time
  const remainingProgress = 100 - elapsedProgress; // Percentage of remaining time

  // Data for the bar chart
  const data = [
    {
      name: 'Timeline',
      elapsed: elapsedProgress, // Green bar for elapsed time
      remaining: remainingProgress, // Blue bar for remaining time
    },
  ];

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col xs="12" md="8">
          <h6 className="text-center font-weight-bold">Development Timelines</h6>

          {/* Recharts Development Timeline */}
          <ResponsiveContainer width="100%" height={60}>
            <BarChart data={data} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" hide />
              <Tooltip />
              <Legend />
              {/* Elapsed Time in Green */}
              <Bar dataKey="elapsed" fill="#4caf50" />
              {/* Remaining Time in Blue */}
              <Bar dataKey="remaining" fill="#2196f3" />
            </BarChart>
          </ResponsiveContainer>

          {/* Timeline labels for FY */}
          <Row>
            <Col xs="4" className="text-center">
              <small className="text-success">FY21-22</small>
            </Col>
            <Col xs="4" className="text-center">
              <small className="text-primary">FY24-25</small>
            </Col>
            <Col xs="4" className="text-center">
              <small className="text-primary">FY36-37</small>
            </Col>
          </Row>

          {/* Legend explaining the colors */}
          <Row className="mt-3">
            <Col xs="6" className="text-center">
              <small className="text-success font-weight-bold">
                Green: Elapsed Time
              </small>
            </Col>
            <Col xs="6" className="text-center">
              <small className="text-primary font-weight-bold">
                Blue: Remaining Time
              </small>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default DevelopmentTimeline;

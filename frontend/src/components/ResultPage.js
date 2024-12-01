import React from "react";
import { Typography, Container, Paper, List, ListItem, ListItemText } from "@mui/material";

const ResultPage = ({ recommendations }) => {
  return (
    <Container
      maxWidth="md"
      sx={{
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        marginTop: "30px",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          추천된 일자리 목록
        </Typography>
        {recommendations.length > 0 ? (
          <List>
            {recommendations.map((job, index) => (
              <ListItem key={index}>
                <ListItemText primary={job.title} secondary={job.description} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="textSecondary">
            추천 결과가 없습니다.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ResultPage;

// src/components/BackToTopButton.js
import React, { useState, useEffect } from "react";
import { Fab, Box, Tooltip } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show the button when scrolling down 200px from the top
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll smoothly to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 1000,
        display: isVisible ? "flex" : "none",
      }}
    >
      <Tooltip title="Back to top" arrow>
        <Fab color="primary" onClick={scrollToTop} aria-label="back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
}

export default BackToTopButton;

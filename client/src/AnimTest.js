import { css } from "@emotion/react";
import { Container, Grid } from "@mui/material";
import { useState } from "react";
import { Transition } from "react-transition-group";

const items = [
  { title: "dog", color: "blue", id: "a77" },
  { title: "cat", color: "orange", id: "c28" },
  { title: "parrot", color: "green", id: "ba6" },
  { title: "turtle", color: "pink", id: "8fa" },
  { title: "hedgehog", color: "khaki", id: "c47" },
  { title: "snake", color: "lime", id: "e56" },
  { title: "zebra", color: "brown", id: "e75" },
  { title: "monkey", color: "crimson", id: "b21" },
  { title: "crocodile", color: "skyblue", id: "a64" },
  { title: "donkey", color: "purple", id: "fab" },
];

const animDuration = 300;

const gridStyle = css`
  .animal {
    box-sizing: border-box;
    width: 100%;
    height: 150px;
    padding: 2rem;
    color: white;
    text-align: center;
    transition-property: opacity;
    transition-duration: ${animDuration}ms;
  }
  .animal-entering {
    opacity: 1;
    transition-delay: 600ms;
  }
  .animal-entered {
    opacity: 1;
  }
  .animal-exiting {
    opacity: 0;
  }
  .animal-exited {
    opacity: 0;
  }
`;

const AnimTest = () => {
  const [list, setList] = useState(items.map((item) => ({ ...item, visible: true })));

  const hideItem = (id) => {
    setList((list) =>
      list.map((item) => ({ ...item, visible: id === item.id ? false : item.visible }))
    );
  };

  const removeItem = (id) => {
    setList((list) => list.filter((item) => item.id !== id));
  };

  return (
    <Container maxWidth="lg">
      <Grid container sx={gridStyle}>
        {list.map((item) => (
          <Transition in={item.visible} key={item.id} timeout={animDuration} unmountOnExit>
            {(state) => (
              <Grid item sm={6} key={item.id}>
                <div
                  className={`animal animal-${state}`}
                  style={{ backgroundColor: item.color }}
                  onClick={() => hideItem(item.id)}
                >
                  {item.title}
                </div>
              </Grid>
            )}
          </Transition>
        ))}
      </Grid>
    </Container>
  );
};

export default AnimTest;

import React from 'react';

const Header = ({ courseName }: { courseName: string }) => {
  return (
    <div>
      <h1>{courseName}</h1>
    </div>
  );
};

interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CourseDescription extends CoursePartBase {
  description: string
}

interface CourseNormalPart extends CourseDescription {
  type: "normal";
}

interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CourseDescription {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseSpecialPart extends CourseDescription {
  type: "special";
  requirements: Array<string>;
}

type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | CourseSpecialPart;

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union number: ${JSON.stringify(value)}`
  );
};

const Title = ({ part }: { part: CoursePart }) => {
  return <h3>{part.name} {part.exerciseCount}</h3>;
};

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.type) {
    case "normal":
      return (
        <div>
          <Title part={part} />
          <i>{part.description}</i>
        </div>
      )
    case "groupProject":
      return (
        <div>
          <Title part={part} />
          <p>project exercises: {part.groupProjectCount}</p>
        </div>
      )
    case "submission":
      return (
        <div>
          <Title part={part} />
          <i>{part.description}</i>
          <p>submit to {part.exerciseSubmissionLink}</p>
        </div>
      )
    case "special":
      return (
        <div>
          <Title part={part} />
          <i>{part.description}</i>
          <p>required skills: {part.requirements.map(r => <i key={r}>{r}&ensp;</i>)}</p>
        </div>
      )
    default:
      return assertNever(part)
  }
}

const Content = ({ courseParts }: { courseParts: Array<CoursePart> }) => {
  const parts = courseParts.map(c => <Part key={c.name} part={c} />)
  return (
    <div>{parts}</div>
  );
};

const Total = ({ courseParts }: { courseParts: Array<CoursePart> }) => {
  return (
    <div>
      <p>Number of exercises{" "}
        {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
      </p>
    </div>
  );
};
const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is the leisured course part",
      type: "normal"
    },
    {
      name: "Advanced",
      exerciseCount: 7,
      description: "This is the harded course part",
      type: "normal"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      type: "groupProject"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
      type: "submission"
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      type: "special"
    }
  ]

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <br />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
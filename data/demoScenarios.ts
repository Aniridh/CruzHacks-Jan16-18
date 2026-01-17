// Pre-loaded demo scenarios for hackathon presentation

import { Transcript } from '@/types';

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  environmentType: 'apartment' | 'office' | 'school' | 'forest';
  transcript: Transcript;
}

export const demoScenarios: DemoScenario[] = [
  {
    id: 'apartment-fire-1',
    name: 'Apartment Fire - Second Floor',
    description: 'Fire on second floor near stairwell, heavy smoke, victim trapped',
    environmentType: 'apartment',
    transcript: {
      text: "There's a fire on the second floor near the stairwell — a lot of smoke — I can't see the exit. I'm in apartment 2B, the smoke is coming from down the hallway. I can hear crackling but I don't know where the fire started exactly. I tried to go down the stairs but there's too much smoke. The fire alarm is going off but I can't see anything. I need help getting out.",
      timestamp: new Date(),
    },
  },
  {
    id: 'office-fire-1',
    name: 'Office Building Fire',
    description: 'Fire in break room, spreading to main office area',
    environmentType: 'office',
    transcript: {
      text: "I work in an office building on the third floor. There's a fire in the break room — I can see flames through the glass door. The smoke is spreading into the main office area where I am. I'm in the cubicle section near the elevators. I don't see anyone else on this floor. The sprinklers haven't activated yet. I can smell something burning, like electrical. I need to know the safest way out of here.",
      timestamp: new Date(),
    },
  },
  {
    id: 'school-fire-1',
    name: 'School Fire - Science Lab',
    description: 'Fire in science lab, students in nearby classrooms',
    environmentType: 'school',
    transcript: {
      text: "This is an emergency at Lincoln High School. There's a fire in the science lab on the second floor. I'm a teacher in room 214, which is right next to the lab. I can see smoke coming under the door. There are about 25 students in my classroom. We can hear the fire alarm. The hallway outside is getting smoky. I need to know if we should stay put or try to evacuate through the hallway. The nearest stairwell is about 50 feet down the hall.",
      timestamp: new Date(),
    },
  },
  {
    id: 'forest-fire-1',
    name: 'Forest Fire - Hiking Trail',
    description: 'Wildfire near hiking trail, campers in danger',
    environmentType: 'forest',
    transcript: {
      text: "We're camping on the Redwood Trail and there's a fire coming from the north. I can see flames about a quarter mile away. The wind is pushing it toward us. We're in a clearing with about 15 people. The trail splits — one goes east toward the river, the other goes west up the hill. I don't know which way is safer. The smoke is getting thick. We need to know which evacuation route to take.",
      timestamp: new Date(),
    },
  },
  {
    id: 'apartment-fire-2',
    name: 'Apartment Fire - Kitchen',
    description: 'Kitchen fire spreading to living room, multiple floors affected',
    environmentType: 'apartment',
    transcript: {
      text: "My kitchen caught fire on the fourth floor. It started in the oven and spread to the cabinets. I tried to put it out but it's too big now. The smoke is filling my apartment and going into the hallway. I'm in apartment 4C. I have my neighbors in 4B and 4A who might be affected. The fire is spreading into my living room. I've already evacuated my unit but I'm worried about the smoke going up to the fifth floor. The stairs are right down the hall.",
      timestamp: new Date(),
    },
  },
];

export const getScenarioById = (id: string): DemoScenario | undefined => {
  return demoScenarios.find((scenario) => scenario.id === id);
};

export const getScenariosByEnvironment = (environmentType: string): DemoScenario[] => {
  return demoScenarios.filter((scenario) => scenario.environmentType === environmentType);
};

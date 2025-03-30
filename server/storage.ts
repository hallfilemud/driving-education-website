import { 
  State, InsertState, 
  Question, InsertQuestion, 
  Resource, InsertResource,
  DrivingTip, InsertDrivingTip,
  User, InsertUser
} from "@shared/schema";

export interface IStorage {
  // State methods
  getAllStates(): Promise<State[]>;
  getState(id: number): Promise<State | undefined>;
  getStateByAbbreviation(abbreviation: string): Promise<State | undefined>;
  createState(state: InsertState): Promise<State>;

  // Question methods
  getAllQuestions(): Promise<Question[]>;
  getQuestionsByState(stateId: number): Promise<Question[]>;
  getQuestionsByCategory(category: string): Promise<Question[]>;
  getQuestion(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;

  // Resource methods
  getAllResources(): Promise<Resource[]>;
  getResourcesByState(stateId: number): Promise<Resource[]>;
  getFeaturedResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Driving tip methods
  getAllDrivingTips(): Promise<DrivingTip[]>;
  getDrivingTipsByCategory(category: string): Promise<DrivingTip[]>;
  getDrivingTip(id: number): Promise<DrivingTip | undefined>;
  createDrivingTip(tip: InsertDrivingTip): Promise<DrivingTip>;

  // User methods
  subscribeUser(user: InsertUser): Promise<User>;
  unsubscribeUser(email: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private states: Map<number, State>;
  private questions: Map<number, Question>;
  private resources: Map<number, Resource>;
  private drivingTips: Map<number, DrivingTip>;
  private users: Map<number, User>;

  private stateId = 1;
  private questionId = 1;
  private resourceId = 1;
  private drivingTipId = 1;
  private userId = 1;

  constructor() {
    this.states = new Map();
    this.questions = new Map();
    this.resources = new Map();
    this.drivingTips = new Map();
    this.users = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize with some states
    const statesList = [
      { name: "Alabama", abbreviation: "AL", description: "Information about driving in Alabama" },
      { name: "Alaska", abbreviation: "AK", description: "Information about driving in Alaska" },
      { name: "Arizona", abbreviation: "AZ", description: "Information about driving in Arizona" },
      { name: "Arkansas", abbreviation: "AR", description: "Information about driving in Arkansas" },
      { name: "California", abbreviation: "CA", description: "Information about driving in California", resourceUrl: "/states/california", manualUrl: "/pdfs/california-drivers-handbook.pdf" },
      { name: "Colorado", abbreviation: "CO", description: "Information about driving in Colorado" },
      { name: "Connecticut", abbreviation: "CT", description: "Information about driving in Connecticut" },
      { name: "Delaware", abbreviation: "DE", description: "Information about driving in Delaware" },
      { name: "Florida", abbreviation: "FL", description: "Information about driving in Florida" },
      { name: "Georgia", abbreviation: "GA", description: "Information about driving in Georgia" },
      { name: "Hawaii", abbreviation: "HI", description: "Information about driving in Hawaii" },
      { name: "Idaho", abbreviation: "ID", description: "Information about driving in Idaho" },
      { name: "Illinois", abbreviation: "IL", description: "Information about driving in Illinois" },
      { name: "Indiana", abbreviation: "IN", description: "Information about driving in Indiana" },
      { name: "Iowa", abbreviation: "IA", description: "Information about driving in Iowa" },
      { name: "Kansas", abbreviation: "KS", description: "Information about driving in Kansas" },
      { name: "Kentucky", abbreviation: "KY", description: "Information about driving in Kentucky" },
      { name: "Louisiana", abbreviation: "LA", description: "Information about driving in Louisiana" },
      { name: "Maine", abbreviation: "ME", description: "Information about driving in Maine" },
      { name: "Maryland", abbreviation: "MD", description: "Information about driving in Maryland" },
      { name: "Massachusetts", abbreviation: "MA", description: "Information about driving in Massachusetts" },
      { name: "Michigan", abbreviation: "MI", description: "Information about driving in Michigan" },
      { name: "Minnesota", abbreviation: "MN", description: "Information about driving in Minnesota" },
      { name: "Mississippi", abbreviation: "MS", description: "Information about driving in Mississippi" },
      { name: "Missouri", abbreviation: "MO", description: "Information about driving in Missouri" },
      { name: "Montana", abbreviation: "MT", description: "Information about driving in Montana" },
      { name: "Nebraska", abbreviation: "NE", description: "Information about driving in Nebraska" },
      { name: "Nevada", abbreviation: "NV", description: "Information about driving in Nevada" },
      { name: "New Hampshire", abbreviation: "NH", description: "Information about driving in New Hampshire" },
      { name: "New Jersey", abbreviation: "NJ", description: "Information about driving in New Jersey" },
      { name: "New Mexico", abbreviation: "NM", description: "Information about driving in New Mexico" },
      { name: "New York", abbreviation: "NY", description: "Information about driving in New York" },
      { name: "North Carolina", abbreviation: "NC", description: "Information about driving in North Carolina" },
      { name: "North Dakota", abbreviation: "ND", description: "Information about driving in North Dakota" },
      { name: "Ohio", abbreviation: "OH", description: "Information about driving in Ohio" },
      { name: "Oklahoma", abbreviation: "OK", description: "Information about driving in Oklahoma" },
      { name: "Oregon", abbreviation: "OR", description: "Information about driving in Oregon" },
      { name: "Pennsylvania", abbreviation: "PA", description: "Information about driving in Pennsylvania" },
      { name: "Rhode Island", abbreviation: "RI", description: "Information about driving in Rhode Island" },
      { name: "South Carolina", abbreviation: "SC", description: "Information about driving in South Carolina" },
      { name: "South Dakota", abbreviation: "SD", description: "Information about driving in South Dakota" },
      { name: "Tennessee", abbreviation: "TN", description: "Information about driving in Tennessee" },
      { name: "Texas", abbreviation: "TX", description: "Information about driving in Texas" },
      { name: "Utah", abbreviation: "UT", description: "Information about driving in Utah" },
      { name: "Vermont", abbreviation: "VT", description: "Information about driving in Vermont" },
      { name: "Virginia", abbreviation: "VA", description: "Information about driving in Virginia" },
      { name: "Washington", abbreviation: "WA", description: "Information about driving in Washington" },
      { name: "West Virginia", abbreviation: "WV", description: "Information about driving in West Virginia" },
      { name: "Wisconsin", abbreviation: "WI", description: "Information about driving in Wisconsin" },
      { name: "Wyoming", abbreviation: "WY", description: "Information about driving in Wyoming" }
    ];

    statesList.forEach(state => this.createState(state));

    // Initialize with sample questions
    const sampleQuestions = [
      {
        stateId: 5, // California
        category: "General Knowledge",
        question: "When approaching a school bus with flashing red lights from either direction, you must:",
        options: [
          "Slow down and proceed with caution",
          "Stop at least 10 feet away until the lights stop flashing",
          "Pass if children have already exited the bus",
          "Honk and drive around the bus carefully"
        ],
        correctAnswer: "Stop at least 10 feet away until the lights stop flashing",
        explanation: "You must stop at least 10 feet away from a school bus that has its red lights flashing. Remain stopped until the lights stop flashing, the bus driver signals you to proceed, or the bus resumes motion."
      },
      {
        stateId: 5, // California
        category: "Road Signs",
        question: "What does a solid yellow line on your side of the center line mean?",
        options: [
          "You can pass if it's safe",
          "No passing allowed",
          "Two-way traffic ahead",
          "School zone ahead"
        ],
        correctAnswer: "No passing allowed",
        explanation: "A solid yellow line on your side of the center line indicates that passing is prohibited in that lane. This is typically used in areas where passing would be dangerous."
      },
      {
        stateId: null, // General question
        category: "General Knowledge",
        question: "What should you do if your vehicle starts to skid?",
        options: [
          "Slam on the brakes immediately",
          "Steer in the direction you want to go and avoid sudden movements",
          "Turn the steering wheel in the opposite direction of the skid",
          "Accelerate to gain better traction"
        ],
        correctAnswer: "Steer in the direction you want to go and avoid sudden movements",
        explanation: "If your vehicle starts to skid, remain calm, ease off the accelerator, and steer in the direction you want the vehicle to go. Avoid sudden movements that could further destabilize the vehicle."
      },
      {
        stateId: null, // General question
        category: "General Knowledge",
        question: "What is the appropriate action when approaching a yellow traffic light?",
        options: [
          "Speed up to get through the intersection",
          "Stop immediately, regardless of position",
          "Prepare to stop if it's safe to do so",
          "Treat it like a four-way stop"
        ],
        correctAnswer: "Prepare to stop if it's safe to do so",
        explanation: "A yellow light means the signal is about to turn red. You should prepare to stop if you can do so safely. If you're too close to the intersection to stop safely, proceed with caution."
      },
      {
        stateId: null, // General question
        category: "General Knowledge",
        question: "When driving in fog, you should use:",
        options: [
          "High beam headlights",
          "Low beam headlights",
          "Parking lights only",
          "Hazard lights while moving"
        ],
        correctAnswer: "Low beam headlights",
        explanation: "In fog, you should use low beam headlights. High beams reflect off the fog and create glare, making it harder to see. Low beams direct light downward onto the road, improving visibility."
      },
      {
        stateId: null, // General question
        category: "General Knowledge",
        question: "What is the proper following distance in ideal conditions?",
        options: [
          "1 second behind the vehicle ahead",
          "At least 2 seconds behind the vehicle ahead",
          "At least 3 seconds behind the vehicle ahead",
          "5 car lengths, regardless of speed"
        ],
        correctAnswer: "At least 3 seconds behind the vehicle ahead",
        explanation: "The 3-second rule is recommended for following distance in ideal conditions. This gives you enough time to react and brake if the vehicle ahead stops suddenly. In adverse conditions, increase this to 5-6 seconds."
      },
      {
        stateId: null, // General question
        category: "General Knowledge",
        question: "What should you do when an emergency vehicle with flashing lights approaches?",
        options: [
          "Speed up to get out of the way",
          "Stop immediately where you are",
          "Pull over to the right and stop",
          "Change lanes to let it pass"
        ],
        correctAnswer: "Pull over to the right and stop",
        explanation: "When an emergency vehicle with flashing lights approaches, you must pull over to the right edge of the road when safe to do so, and come to a complete stop. Wait until the emergency vehicle has passed before resuming driving."
      },
      {
        stateId: null, // General question
        category: "General Knowledge",
        question: "When turning right at a red light, you must:",
        options: [
          "Come to a complete stop, yield, then turn if clear",
          "Slow down and check for traffic before turning",
          "Wait for a green light before turning",
          "Stop for at least 3 seconds before turning"
        ],
        correctAnswer: "Come to a complete stop, yield, then turn if clear",
        explanation: "When turning right on a red light, you must first come to a complete stop, yield to pedestrians and all cross traffic, and then turn when it is safe to do so. Some intersections prohibit right turns on red with signs."
      },
      {
        stateId: null, // General question
        category: "Road Signs",
        question: "A diamond-shaped sign indicates:",
        options: [
          "Stop ahead",
          "School zone",
          "Warning or hazard ahead",
          "Construction zone"
        ],
        correctAnswer: "Warning or hazard ahead",
        explanation: "Diamond-shaped signs are warning signs that alert drivers to upcoming hazards or changing road conditions. These yellow signs prepare you for things like curves, intersections, or other potential dangers."
      },
      {
        stateId: null, // General question
        category: "Road Signs",
        question: "An octagonal sign always means:",
        options: [
          "Yield",
          "Stop",
          "Railroad crossing",
          "School zone"
        ],
        correctAnswer: "Stop",
        explanation: "An octagonal (eight-sided) sign always means stop. This shape is exclusively used for stop signs to ensure they're recognizable even when visibility is poor or the sign's color has faded."
      },
      {
        stateId: null, // General question
        category: "General Knowledge",
        question: "When parking downhill with a curb, you should turn your front wheels:",
        options: [
          "Straight ahead",
          "Away from the curb",
          "Toward the curb",
          "In the direction of traffic"
        ],
        correctAnswer: "Toward the curb",
        explanation: "When parking downhill with a curb, turn your front wheels toward the curb (right). This positioning ensures that if your brakes fail, your vehicle will roll into the curb rather than into traffic."
      },
      {
        stateId: null, // General question
        category: "General Knowledge",
        question: "What does a flashing yellow arrow signal mean?",
        options: [
          "You must stop before turning",
          "Yield to oncoming traffic and pedestrians, then proceed with caution",
          "The light is about to turn red",
          "Protected left turn is allowed"
        ],
        correctAnswer: "Yield to oncoming traffic and pedestrians, then proceed with caution",
        explanation: "A flashing yellow arrow means you may turn in the direction of the arrow after yielding to oncoming traffic and pedestrians. Unlike a solid green light, the flashing yellow arrow specifically reminds drivers they must yield before turning."
      }
    ];

    sampleQuestions.forEach(question => this.createQuestion(question));

    // Initialize with sample resources
    const sampleResources = [
      {
        title: "California Driver's Handbook",
        description: "Complete guide to driving laws and practices in California. Updated for 2023.",
        fileUrl: "/pdfs/california-drivers-handbook.pdf",
        fileSize: "5.2 MB",
        featured: true,
        category: "Driver's Manual",
        stateId: 5, // California
        imageUrl: "https://images.unsplash.com/photo-1476984251899-8d7fdfc5c92c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isNew: false
      },
      {
        title: "Road Signs & Signals Guide",
        description: "Comprehensive guide to understanding road signs and traffic signals across all states.",
        fileUrl: "/pdfs/road-signs-guide.pdf",
        fileSize: "3.8 MB",
        featured: true,
        category: "Road Signs",
        stateId: null,
        imageUrl: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isNew: false
      },
      {
        title: "DMV Test Prep Guide",
        description: "Practice questions, testing strategies, and expert tips to help you pass your test on the first try.",
        fileUrl: "/pdfs/dmv-test-prep.pdf",
        fileSize: "4.5 MB",
        featured: true,
        category: "Test Preparation",
        stateId: null,
        imageUrl: "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isNew: true
      }
    ];

    sampleResources.forEach(resource => this.createResource(resource));

    // Initialize with sample driving tips
    const drivingTipsList = [
      {
        title: "Maintain a Safe Following Distance",
        content: "Use the \"3-second rule\" to ensure you're keeping enough distance from the vehicle ahead. In adverse conditions, increase this to 5-6 seconds.",
        category: "Safety"
      },
      {
        title: "Eliminate Distractions",
        content: "Put your phone away, set your GPS before driving, and avoid eating or adjusting controls when in motion. Focus solely on driving.",
        category: "Safety"
      },
      {
        title: "Adjust for Weather Conditions",
        content: "Reduce your speed in rain, snow, or fog. Use headlights for visibility, and increase following distance. Avoid sudden braking or turns.",
        category: "Weather"
      },
      {
        title: "Practice Defensive Driving",
        content: "Anticipate what other drivers might do and be prepared to react. Always have an escape route and stay aware of your surroundings.",
        category: "Safety"
      }
    ];

    drivingTipsList.forEach(tip => this.createDrivingTip(tip));
  }

  // State methods
  async getAllStates(): Promise<State[]> {
    return Array.from(this.states.values());
  }

  async getState(id: number): Promise<State | undefined> {
    return this.states.get(id);
  }

  async getStateByAbbreviation(abbreviation: string): Promise<State | undefined> {
    return Array.from(this.states.values()).find(
      state => state.abbreviation.toLowerCase() === abbreviation.toLowerCase()
    );
  }

  async createState(state: InsertState): Promise<State> {
    const id = this.stateId++;
    const newState: State = { ...state, id };
    this.states.set(id, newState);
    return newState;
  }

  // Question methods
  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values());
  }

  async getQuestionsByState(stateId: number): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(
      question => question.stateId === stateId || question.stateId === null
    );
  }

  async getQuestionsByCategory(category: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(
      question => question.category === category
    );
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const id = this.questionId++;
    const newQuestion: Question = { ...question, id };
    this.questions.set(id, newQuestion);
    return newQuestion;
  }

  // Resource methods
  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResourcesByState(stateId: number): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      resource => resource.stateId === stateId || resource.stateId === null
    );
  }

  async getFeaturedResources(): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      resource => resource.featured
    );
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      resource => resource.category === category
    );
  }

  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const id = this.resourceId++;
    const newResource: Resource = { ...resource, id };
    this.resources.set(id, newResource);
    return newResource;
  }

  // Driving tip methods
  async getAllDrivingTips(): Promise<DrivingTip[]> {
    return Array.from(this.drivingTips.values());
  }

  async getDrivingTipsByCategory(category: string): Promise<DrivingTip[]> {
    return Array.from(this.drivingTips.values()).filter(
      tip => tip.category === category
    );
  }

  async getDrivingTip(id: number): Promise<DrivingTip | undefined> {
    return this.drivingTips.get(id);
  }

  async createDrivingTip(tip: InsertDrivingTip): Promise<DrivingTip> {
    const id = this.drivingTipId++;
    const newTip: DrivingTip = { ...tip, id };
    this.drivingTips.set(id, newTip);
    return newTip;
  }

  // User methods
  async subscribeUser(user: InsertUser): Promise<User> {
    const existingUser = Array.from(this.users.values()).find(
      u => u.email === user.email
    );

    if (existingUser) {
      existingUser.subscribed = true;
      this.users.set(existingUser.id, existingUser);
      return existingUser;
    }

    const id = this.userId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async unsubscribeUser(email: string): Promise<boolean> {
    const user = Array.from(this.users.values()).find(
      u => u.email === email
    );

    if (user) {
      user.subscribed = false;
      this.users.set(user.id, user);
      return true;
    }

    return false;
  }
}

export const storage = new MemStorage();

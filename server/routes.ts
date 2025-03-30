import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  const apiRouter = app.route('/api');

  // Get all states
  app.get('/api/states', async (req, res) => {
    try {
      const states = await storage.getAllStates();
      res.json(states);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch states', error: (error as Error).message });
    }
  });

  // Get a specific state by abbreviation
  app.get('/api/states/:abbreviation', async (req, res) => {
    try {
      const { abbreviation } = req.params;
      const state = await storage.getStateByAbbreviation(abbreviation);
      
      if (!state) {
        return res.status(404).json({ message: 'State not found' });
      }
      
      res.json(state);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch state', error: (error as Error).message });
    }
  });

  // Get questions for a state
  app.get('/api/states/:stateId/questions', async (req, res) => {
    try {
      const stateId = parseInt(req.params.stateId);
      
      if (isNaN(stateId)) {
        return res.status(400).json({ message: 'Invalid state ID' });
      }
      
      const questions = await storage.getQuestionsByState(stateId);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch questions', error: (error as Error).message });
    }
  });

  // Get resources for a state
  app.get('/api/states/:stateId/resources', async (req, res) => {
    try {
      const stateId = parseInt(req.params.stateId);
      
      if (isNaN(stateId)) {
        return res.status(400).json({ message: 'Invalid state ID' });
      }
      
      const resources = await storage.getResourcesByState(stateId);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch resources', error: (error as Error).message });
    }
  });

  // Get all featured resources
  app.get('/api/resources/featured', async (req, res) => {
    try {
      const resources = await storage.getFeaturedResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch featured resources', error: (error as Error).message });
    }
  });

  // Get all questions by category
  app.get('/api/questions/category/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const questions = await storage.getQuestionsByCategory(category);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch questions', error: (error as Error).message });
    }
  });

  // Get all driving tips
  app.get('/api/driving-tips', async (req, res) => {
    try {
      const tips = await storage.getAllDrivingTips();
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch driving tips', error: (error as Error).message });
    }
  });

  // Get driving tips by category
  app.get('/api/driving-tips/category/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const tips = await storage.getDrivingTipsByCategory(category);
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch driving tips', error: (error as Error).message });
    }
  });

  // Subscribe to newsletter
  app.post('/api/subscribe', async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.subscribeUser(validatedData);
      res.status(201).json({ message: 'Successfully subscribed to newsletter', user });
    } catch (error) {
      res.status(400).json({ message: 'Failed to subscribe', error: (error as Error).message });
    }
  });

  // Unsubscribe from newsletter
  app.post('/api/unsubscribe', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      const success = await storage.unsubscribeUser(email);
      
      if (!success) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ message: 'Successfully unsubscribed from newsletter' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to unsubscribe', error: (error as Error).message });
    }
  });

  // Search endpoint
  app.get('/api/search', async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      const searchQuery = query.toLowerCase();
      
      // Search states
      const states = await storage.getAllStates();
      const matchedStates = states.filter(state => 
        state.name.toLowerCase().includes(searchQuery) || 
        state.abbreviation.toLowerCase().includes(searchQuery) ||
        state.description.toLowerCase().includes(searchQuery)
      );
      
      // Search resources
      const resources = await storage.getAllResources();
      const matchedResources = resources.filter(resource => 
        resource.title.toLowerCase().includes(searchQuery) || 
        resource.description.toLowerCase().includes(searchQuery) ||
        resource.category.toLowerCase().includes(searchQuery)
      );
      
      // Search driving tips
      const tips = await storage.getAllDrivingTips();
      const matchedTips = tips.filter(tip => 
        tip.title.toLowerCase().includes(searchQuery) || 
        tip.content.toLowerCase().includes(searchQuery) ||
        tip.category.toLowerCase().includes(searchQuery)
      );
      
      res.json({
        states: matchedStates,
        resources: matchedResources,
        drivingTips: matchedTips
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to perform search', error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

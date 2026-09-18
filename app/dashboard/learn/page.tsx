import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Play, CheckCircle, Clock, Users, Award, Rocket, Globe, Shield, Calculator, FileText, Lightbulb, Download } from "lucide-react"

export default function LearnPage() {
  const learningPaths = [
    {
      id: 1,
      title: "LEO Operations Fundamentals",
      description: "Master the basics of Low Earth Orbit operations and satellite management",
      modules: 8,
      duration: "4 hours",
      difficulty: "Beginner",
      progress: 0,
      icon: Rocket,
      topics: ["Orbital Mechanics", "Satellite Types", "LEO Environment", "Mission Planning"],
    },
    {
      id: 2,
      title: "Space Commerce & Business Models",
      description: "Understand the economics of space and commercial LEO opportunities",
      modules: 6,
      duration: "3 hours",
      difficulty: "Intermediate",
      progress: 25,
      icon: Globe,
      topics: ["Market Analysis", "Revenue Models", "Cost Structures", "Investment Strategies"],
    },
    {
      id: 3,
      title: "Risk Analysis & Compliance",
      description: "Learn space debris mitigation and regulatory compliance (ISO 24113)",
      modules: 10,
      duration: "5 hours",
      difficulty: "Advanced",
      progress: 60,
      icon: Shield,
      topics: ["Debris Tracking", "Collision Prediction", "ISO Standards", "Risk Mitigation"],
    },
    {
      id: 4,
      title: "Financial Modeling for Space",
      description: "Advanced financial analysis and ROI calculations for space ventures",
      modules: 7,
      duration: "4 hours",
      difficulty: "Advanced",
      progress: 0,
      icon: Calculator,
      topics: ["ROI Analysis", "Cost Modeling", "Revenue Forecasting", "Investment Planning"],
    },
  ]

  const quickTutorials = [
    {
      title: "Getting Started with Satellite Tracking",
      duration: "15 min",
      type: "Video Tutorial",
      completed: false,
    },
    {
      title: "Understanding TLE Data",
      duration: "10 min",
      type: "Interactive Guide",
      completed: true,
    },
    {
      title: "Risk Assessment Basics",
      duration: "20 min",
      type: "Step-by-step",
      completed: false,
    },
    {
      title: "Financial Dashboard Overview",
      duration: "12 min",
      type: "Video Tutorial",
      completed: true,
    },
  ]

  const resources = [
    {
      title: "NASA LEO Economy Report 2025",
      type: "Research Paper",
      description: "Comprehensive analysis of the $447B LEO market opportunity",
    },
    {
      title: "ISO 24113 Compliance Guide",
      type: "Documentation",
      description: "Complete guide to space debris mitigation standards",
    },
    {
      title: "Orbital Mechanics Calculator",
      type: "Tool",
      description: "Interactive calculator for orbital parameters and predictions",
    },
    {
      title: "Space Industry Glossary",
      type: "Reference",
      description: "Essential terminology for space commerce professionals",
    },
  ]

  const spaceEconomyModules = [
    {
      title: "Global Space Economy Overview",
      description: "Understanding the $447B space economy and LEO market opportunities",
      duration: "45 min",
      type: "Interactive Lesson",
      completed: false,
      topics: ["Market Size", "Key Players", "Growth Trends", "Investment Flows"]
    },
    {
      title: "LEO Commercial Applications", 
      description: "Satellite services, manufacturing, tourism, and research opportunities",
      duration: "60 min",
      type: "Case Studies",
      completed: true,
      topics: ["Satellite Communications", "Earth Observation", "Space Tourism", "Manufacturing"]
    },
    {
      title: "Business Model Innovation",
      description: "Revenue streams, pricing strategies, and sustainable business models",
      duration: "50 min", 
      type: "Workshop",
      completed: false,
      topics: ["SaaS Models", "Data Monetization", "Partnership Strategies", "Scalability"]
    }
  ]

  const spaceLawModules = [
    {
      title: "International Space Law Fundamentals",
      description: "UN Outer Space Treaty, liability conventions, and international frameworks",
      duration: "40 min",
      type: "Legal Framework",
      completed: true,
      topics: ["Outer Space Treaty", "Liability Convention", "Registration Convention", "Moon Agreement"]
    },
    {
      title: "National Regulations & Licensing",
      description: "Country-specific space laws, licensing requirements, and compliance",
      duration: "35 min",
      type: "Regulatory Guide",
      completed: false,
      topics: ["US Commercial Space Law", "EU Space Regulations", "National Licensing", "Export Controls"]
    },
    {
      title: "Debris Mitigation & Environmental Law",
      description: "ISO 24113, environmental protection, and sustainable space operations",
      duration: "55 min",
      type: "Compliance Training",
      completed: false,
      topics: ["ISO 24113 Standards", "Debris Mitigation", "Environmental Impact", "Best Practices"]
    }
  ]

  const sustainabilityModules = [
    {
      title: "Sustainable LEO Operations",
      description: "Environmental considerations and long-term sustainability planning",
      duration: "45 min",
      type: "Best Practices",
      completed: false,
      topics: ["Carbon Footprint", "Resource Efficiency", "Circular Economy", "Green Technologies"]
    },
    {
      title: "Space Debris Management",
      description: "Active debris removal, collision avoidance, and responsible disposal",
      duration: "50 min",
      type: "Technical Training",
      completed: true,
      topics: ["Debris Tracking", "Collision Prediction", "Active Removal", "End-of-Life Planning"]
    },
    {
      title: "Future of Space Sustainability",
      description: "Emerging technologies and innovative solutions for sustainable space",
      duration: "40 min",
      type: "Innovation Focus",
      completed: false,
      topics: ["Clean Propulsion", "Reusable Systems", "In-Orbit Servicing", "Sustainable Manufacturing"]
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Hub</h1>
          <p className="text-gray-600 mt-2">Master LEO operations and space commerce with expert-designed courses</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-[#4e6aff]/10 text-[#4e6aff] border-[#4e6aff]/20">
            <Award className="w-4 h-4 mr-1" />7 Certificates Available
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="paths" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="economics">Space Economics</TabsTrigger>
          <TabsTrigger value="law">Space Law</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>

        <TabsContent value="paths" className="space-y-8">
          {/* Learning Paths */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Learning Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningPaths.map((path) => {
                const IconComponent = path.icon
                return (
                  <Card key={path.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#4e6aff]/10 rounded-lg">
                            <IconComponent className="w-6 h-6 text-[#4e6aff]" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{path.title}</CardTitle>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {path.modules} modules
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {path.duration}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {path.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{path.description}</CardDescription>

                      {path.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="text-[#4e6aff] font-medium">{path.progress}%</span>
                          </div>
                          <Progress value={path.progress} className="h-2" />
                        </div>
                      )}

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Topics covered:</p>
                        <div className="flex flex-wrap gap-2">
                          {path.topics.map((topic, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        className="w-full bg-[#4e6aff] hover:bg-[#4e6aff]/90"
                        variant={path.progress > 0 ? "default" : "default"}
                      >
                        {path.progress > 0 ? "Continue Learning" : "Start Learning"}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Quick Tutorials */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickTutorials.map((tutorial, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-[#4e6aff]/10 rounded-lg">
                        <Play className="w-5 h-5 text-[#4e6aff]" />
                      </div>
                      {tutorial.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{tutorial.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{tutorial.duration}</span>
                      <Badge variant="outline" className="text-xs">
                        {tutorial.type}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant={tutorial.completed ? "outline" : "default"}
                      className={tutorial.completed ? "" : "bg-[#4e6aff] hover:bg-[#4e6aff]/90"}
                    >
                      {tutorial.completed ? "Review" : "Start"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="economics" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Space Economics & Business Models</h2>
            <p className="text-gray-600 mb-6">Master the fundamentals of space commerce and LEO market opportunities</p>
            
            <div className="space-y-4">
              {spaceEconomyModules.map((module, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-[#4e6aff]/10 rounded-lg">
                            <Globe className="w-5 h-5 text-[#4e6aff]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{module.title}</h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {module.duration}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {module.type}
                              </Badge>
                            </div>
                          </div>
                          {module.completed && <CheckCircle className="w-6 h-6 text-green-500" />}
                        </div>
                        <p className="text-gray-600 mb-4">{module.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {module.topics.map((topic, topicIndex) => (
                            <Badge key={topicIndex} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          variant={module.completed ? "outline" : "default"}
                          className={module.completed ? "" : "bg-[#4e6aff] hover:bg-[#4e6aff]/90"}
                        >
                          {module.completed ? "Review" : "Start Module"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="law" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Space Law & Regulatory Compliance</h2>
            <p className="text-gray-600 mb-6">Navigate the complex legal landscape of international and national space regulations</p>
            
            <div className="space-y-4">
              {spaceLawModules.map((module, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-[#4e6aff]/10 rounded-lg">
                            <FileText className="w-5 h-5 text-[#4e6aff]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{module.title}</h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {module.duration}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {module.type}
                              </Badge>
                            </div>
                          </div>
                          {module.completed && <CheckCircle className="w-6 h-6 text-green-500" />}
                        </div>
                        <p className="text-gray-600 mb-4">{module.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {module.topics.map((topic, topicIndex) => (
                            <Badge key={topicIndex} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          variant={module.completed ? "outline" : "default"}
                          className={module.completed ? "" : "bg-[#4e6aff] hover:bg-[#4e6aff]/90"}
                        >
                          {module.completed ? "Review" : "Start Module"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sustainable Space Operations</h2>
            <p className="text-gray-600 mb-6">Learn best practices for environmentally responsible and sustainable LEO activities</p>
            
            <div className="space-y-4">
              {sustainabilityModules.map((module, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Lightbulb className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{module.title}</h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {module.duration}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {module.type}
                              </Badge>
                            </div>
                          </div>
                          {module.completed && <CheckCircle className="w-6 h-6 text-green-500" />}
                        </div>
                        <p className="text-gray-600 mb-4">{module.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {module.topics.map((topic, topicIndex) => (
                            <Badge key={topicIndex} variant="secondary" className="text-xs bg-green-100 text-green-700">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          variant={module.completed ? "outline" : "default"}
                          className={module.completed ? "" : "bg-green-600 hover:bg-green-700"}
                        >
                          {module.completed ? "Review" : "Start Module"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Resources Library */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Resources Library</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Download className="w-5 h-5 text-[#4e6aff]" />
                      <Badge variant="secondary" className="text-xs">
                        {resource.type}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#4e6aff] text-[#4e6aff] hover:bg-[#4e6aff] hover:text-white bg-transparent"
                    >
                      Access Resource
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Section */}
      <Card className="bg-gradient-to-r from-[#4e6aff]/5 to-[#4e6aff]/10 border-[#4e6aff]/20">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Join the Space Commerce Community</h3>
              <p className="text-gray-600 mb-4">
                Connect with industry experts, share insights, and collaborate on LEO projects
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  2,847 members
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  156 discussions
                </span>
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  23 expert mentors
                </span>
              </div>
            </div>
            <Button className="bg-[#4e6aff] hover:bg-[#4e6aff]/90">Join Community</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

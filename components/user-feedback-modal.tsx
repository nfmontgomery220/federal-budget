"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle, Target, AlertTriangle } from "lucide-react"
import { saveUserFeedback } from "@/lib/budget-analytics"

interface UserFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId: string
  budgetBalance: number
  scenarioName: string
}

export function UserFeedbackModal({ isOpen, onClose, sessionId, budgetBalance, scenarioName }: UserFeedbackModalProps) {
  const [politicalAffiliation, setPoliticalAffiliation] = useState("")
  const [incomeBracket, setIncomeBracket] = useState("")
  const [difficultyRating, setDifficultyRating] = useState("")
  const [comments, setComments] = useState("")
  const [wouldSupportPlan, setWouldSupportPlan] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      await saveUserFeedback(sessionId, {
        politicalAffiliation: politicalAffiliation || undefined,
        incomeBracket: incomeBracket || undefined,
        difficultyRating: difficultyRating ? Number.parseInt(difficultyRating) : undefined,
        comments: comments || undefined,
        wouldSupportPlan: wouldSupportPlan === "yes" ? true : wouldSupportPlan === "no" ? false : undefined,
      })

      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting feedback:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isBalanced = budgetBalance >= 0

  const getStatusIcon = () => {
    if (isBalanced) return <CheckCircle className="h-6 w-6 text-green-600" />
    if (budgetBalance > -100) return <Target className="h-6 w-6 text-yellow-600" />
    return <AlertTriangle className="h-6 w-6 text-red-600" />
  }

  const getStatusText = () => {
    if (isBalanced) return "🎉 Budget Balanced!"
    if (budgetBalance > -100) return "📊 Close to Balance"
    return "📈 Budget Challenge"
  }

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-green-800">Thank You!</DialogTitle>
            <DialogDescription>
              Your feedback has been submitted and will help improve this tool for everyone.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center">
            <Button onClick={onClose} className="w-full">
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            {getStatusText()}
          </DialogTitle>
          <DialogDescription>
            {isBalanced
              ? `Congratulations! You balanced the budget using the "${scenarioName}" approach with a surplus of $${Math.abs(
                  budgetBalance,
                ).toFixed(1)}B.`
              : `You completed the budget exercise with a deficit of $${Math.abs(budgetBalance).toFixed(
                  1,
                )}B using the "${scenarioName}" approach.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Political Affiliation (Optional)</Label>
            <Select value={politicalAffiliation} onValueChange={setPoliticalAffiliation}>
              <SelectTrigger>
                <SelectValue placeholder="Select your political leaning" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="progressive">Progressive</SelectItem>
                <SelectItem value="liberal">Liberal</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="conservative">Conservative</SelectItem>
                <SelectItem value="libertarian">Libertarian</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Household Income (Optional)</Label>
            <Select value={incomeBracket} onValueChange={setIncomeBracket}>
              <SelectTrigger>
                <SelectValue placeholder="Select your income bracket" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<50k">Less than $50,000</SelectItem>
                <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                <SelectItem value="100k-200k">$100,000 - $200,000</SelectItem>
                <SelectItem value="200k-500k">$200,000 - $500,000</SelectItem>
                <SelectItem value=">500k">More than $500,000</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>How difficult was this exercise?</Label>
            <RadioGroup value={difficultyRating} onValueChange={setDifficultyRating}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="diff1" />
                <Label htmlFor="diff1">1 - Very Easy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="diff2" />
                <Label htmlFor="diff2">2 - Easy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="diff3" />
                <Label htmlFor="diff3">3 - Moderate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="diff4" />
                <Label htmlFor="diff4">4 - Difficult</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="diff5" />
                <Label htmlFor="diff5">5 - Very Difficult</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Would you support this budget plan in real life?</Label>
            <RadioGroup value={wouldSupportPlan} onValueChange={setWouldSupportPlan}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="support-yes" />
                <Label htmlFor="support-yes">Yes, I would support this plan</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="support-no" />
                <Label htmlFor="support-no">No, I would not support this plan</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unsure" id="support-unsure" />
                <Label htmlFor="support-unsure">I'm unsure</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments (Optional)</Label>
            <Textarea
              id="comments"
              placeholder="Share your thoughts about the budget exercise, what surprised you, or suggestions for improvement..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Skip
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

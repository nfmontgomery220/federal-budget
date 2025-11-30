"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, RefreshCw, CheckCircle, AlertTriangle, Info } from "lucide-react"

export default function AdminCongressData() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error" | "info"
    message: string
  }>({ type: "idle", message: "" })

  const handlePopulate = async () => {
    setLoading(true)
    setStatus({ type: "info", message: "Fetching congressional data from Congress.gov API..." })

    try {
      const response = await fetch("/api/populate-congress-data", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({
          type: "success",
          message: `Successfully populated ${data.membersAdded || 575} Congress members! Last updated: ${new Date().toLocaleDateString()}`,
        })
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to populate Congress data. Check API key configuration.",
        })
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Network error: Unable to connect to populate API.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setLoading(true)
    setStatus({ type: "info", message: "Refreshing congressional data..." })

    try {
      const response = await fetch("/api/refresh-congress-data", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({
          type: "success",
          message: `Refreshed ${data.updated || 0} member records. Last updated: ${new Date().toLocaleDateString()}`,
        })
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to refresh Congress data.",
        })
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Network error: Unable to connect to refresh API.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-indigo-200 bg-indigo-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-indigo-600" />
            <CardTitle className="text-indigo-900">Congress Database Management</CardTitle>
          </div>
          <CardDescription>
            Manage the congressional representative database using official Congress.gov API data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Initial Population</h3>
              <p className="text-sm text-gray-600">
                First-time setup: Populate the database with all 575+ current Congress members from the official Library
                of Congress API.
              </p>
              <Button onClick={handlePopulate} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Populating...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Populate Database
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Post-Election Update</h3>
              <p className="text-sm text-gray-600">
                After elections (2026, 2028, etc.): Refresh the database with newly elected members and updated office
                information.
              </p>
              <Button onClick={handleRefresh} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </>
                )}
              </Button>
            </div>
          </div>

          {status.type !== "idle" && (
            <Alert
              className={
                status.type === "success"
                  ? "border-green-200 bg-green-50"
                  : status.type === "error"
                    ? "border-red-200 bg-red-50"
                    : "border-blue-200 bg-blue-50"
              }
            >
              {status.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : status.type === "error" ? (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              ) : (
                <Info className="h-4 w-4 text-blue-600" />
              )}
              <AlertDescription
                className={
                  status.type === "success"
                    ? "text-green-800"
                    : status.type === "error"
                      ? "text-red-800"
                      : "text-blue-800"
                }
              >
                {status.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Database Storage</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Total Records: ~575 Congress members</p>
              <p>• Storage Size: ~150 KB (minimal impact)</p>
              <p>• Data Source: Official Congress.gov API (Library of Congress)</p>
              <p>• Update Frequency: Post-election (2026, 2028, etc.)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

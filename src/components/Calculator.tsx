import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { RefreshCw, Printer } from 'lucide-react'
import bwipjs from 'bwip-js'

const SHIPPING_RATE_PER_KG = 15000 // KRW per 1000g
const DEFAULT_MARGIN = 20

export function Calculator() {
  const [originalPrice, setOriginalPrice] = useState<number>(10000)
  const [weight, setWeight] = useState<number>(100)
  const [margin, setMargin] = useState<number>(DEFAULT_MARGIN)
  const [exchangeRate, setExchangeRate] = useState<number>(9.8) // Default KRW to UZS rate
  const [isLoadingRate, setIsLoadingRate] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPriceDetailsModalOpen, setIsPriceDetailsModalOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Calculate shipping cost
  const shippingCost = (weight / 1000) * SHIPPING_RATE_PER_KG
  
  // Calculate total cost in KRW
  const totalCostKRW = originalPrice + shippingCost
  
  // Calculate margin amount in KRW
  const marginAmountKRW = totalCostKRW * (margin / 100)
  
  // Calculate final price with margin in KRW
  const priceWithMarginKRW = totalCostKRW + marginAmountKRW
  
  // Convert to UZS and round to nearest thousand
  const retailPriceUZS = Math.round((priceWithMarginKRW * exchangeRate) / 1000) * 1000

  // Fetch exchange rate
  const fetchExchangeRate = useCallback(async () => {
    setIsLoadingRate(true)
    try {
      // In production, you would fetch from a real API
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulated rate (in production, fetch from an API like exchangerate-api.com)
      const newRate = 9.5 + Math.random() * 0.6 // Random between 9.5-10.1
      setExchangeRate(newRate)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error)
    } finally {
      setIsLoadingRate(false)
    }
  }, [])

  // Fetch rate on mount
  useEffect(() => {
    fetchExchangeRate()
  }, [fetchExchangeRate])

  // Format number with thousand separators
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num))
  }

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    })
  }

  // Generate DataMatrix code
  const generateDataMatrix = useCallback(() => {
    if (canvasRef.current) {
      try {
        bwipjs.toCanvas(canvasRef.current, {
          bcid: 'datamatrix',
          text: retailPriceUZS.toString(),
          scale: 6,
          height: 15,
          width: 15,
          includetext: false,
        })
      } catch (error) {
        console.error('Error generating DataMatrix:', error)
      }
    }
  }, [retailPriceUZS])

  // Generate DataMatrix when modal opens
  useEffect(() => {
    if (isModalOpen) {
      // Small delay to ensure canvas is rendered
      setTimeout(generateDataMatrix, 100)
    }
  }, [isModalOpen, generateDataMatrix])

  return (
    <div className="space-y-4">
      {/* Input Fields */}
      <Card>
        <CardContent className="pt-6 pb-6 space-y-6">
          {/* Original Price */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="original-price" className="text-lg font-medium">Asl narxi</Label>
              <span className="text-lg font-semibold text-primary">{formatNumber(originalPrice)} KRW</span>
            </div>
            <div className="py-2">
              <Slider
                id="original-price"
                value={[originalPrice]}
                onValueChange={(value) => setOriginalPrice(value[0])}
                min={500}
                max={50000}
                step={500}
                className="touch-none"
              />
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="weight" className="text-lg font-medium">Og'irligi</Label>
              <span className="text-lg font-semibold text-primary">{weight}g</span>
            </div>
            <div className="py-2">
              <Slider
                id="weight"
                value={[weight]}
                onValueChange={(value) => setWeight(value[0])}
                min={10}
                max={1000}
                step={10}
                className="touch-none"
              />
            </div>
          </div>

          {/* Margin */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="margin" className="text-lg font-medium">Foyda</Label>
              <span className="text-lg font-semibold text-primary">{margin}%</span>
            </div>
            <div className="py-2">
              <Slider
                id="margin"
                value={[margin]}
                onValueChange={(value) => setMargin(value[0])}
                min={5}
                max={50}
                step={1}
                className="touch-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="border-primary/30 bg-primary/10">
        <CardContent className="pt-8 pb-8">
          <button 
            onClick={() => setIsPriceDetailsModalOpen(true)}
            className="w-full text-center cursor-pointer"
          >
            <p className="text-5xl font-bold text-primary">
              {formatNumber(retailPriceUZS)} so'm
            </p>
          </button>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          variant="default"
          className="flex-1 h-20 bg-black hover:bg-gray-800"
          onClick={fetchExchangeRate}
          disabled={isLoadingRate}
        >
          <RefreshCw className={`h-8 w-8 text-white ${isLoadingRate ? 'animate-spin' : ''}`} />
        </Button>
        <Button 
          variant="default"
          className="flex-1 h-20 bg-black hover:bg-gray-800"
          onClick={() => setIsModalOpen(true)}
        >
          <Printer className="h-8 w-8 text-white" />
        </Button>
      </div>

      {/* DataMatrix Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <div className="flex items-center justify-center p-6">
            <canvas ref={canvasRef} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Price Details Modal */}
      <Dialog open={isPriceDetailsModalOpen} onOpenChange={setIsPriceDetailsModalOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <div className="space-y-3 p-4">
            {/* Cost breakdown */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mahsulot narxi:</span>
              <span className="font-semibold">{formatNumber(originalPrice)} KRW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Yetkazib berish:</span>
              <span className="font-semibold">{formatNumber(shippingCost)} KRW</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Jami xarajat:</span>
              <span>{formatNumber(totalCostKRW)} KRW</span>
            </div>
            
            {/* Margin calculation */}
            <div className="flex justify-between pt-3 border-t">
              <span className="text-muted-foreground">Foyda ({margin}%):</span>
              <span className="font-semibold">{formatNumber(marginAmountKRW)} KRW</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Sotish narxi (KRW):</span>
              <span className="text-primary">{formatNumber(priceWithMarginKRW)} KRW</span>
            </div>
            
            {/* Exchange rate and final price */}
            <div className="flex justify-between text-sm pt-3 border-t">
              <span className="text-muted-foreground">Valyuta kursi:</span>
              <span>1 KRW = {exchangeRate.toFixed(2)} UZS</span>
            </div>
            <div className="flex justify-between font-bold text-xl">
              <span>Chakana narx:</span>
              <span className="text-primary">{formatNumber(retailPriceUZS)} so'm</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
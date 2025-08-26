import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Printer } from 'lucide-react'
import bwipjs from 'bwip-js'

const SHIPPING_RATE_PER_KG = 15000 // KRW per 1000g
const DEFAULT_MARGIN = 20

export function Calculator() {
  const [originalPrice, setOriginalPrice] = useState<number>(10000)
  const [weight, setWeight] = useState<number>(100)
  const [margin, setMargin] = useState<number>(DEFAULT_MARGIN)
  const [exchangeRate, setExchangeRate] = useState<number>(9.5) // Default KRW to UZS rate (will be updated from API)
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
    try {
      // Using exchangerate-api.com free tier
      // We need to calculate KRW to UZS through USD
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Get both KRW and UZS rates relative to USD
      const usdToKrw = data.rates?.KRW
      const usdToUzs = data.rates?.UZS
      
      if (!usdToKrw || !usdToUzs) {
        throw new Error('Currency rates not available')
      }
      
      // Calculate KRW to UZS rate (1 KRW = ? UZS)
      const krwToUzs = usdToUzs / usdToKrw
      
      setExchangeRate(krwToUzs)
      
      // Log the fetched rate for debugging
      console.log('Exchange rate updated!')
      console.log(`1 KRW = ${krwToUzs.toFixed(4)} UZS`)
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error)
      // Keep the default rate on error
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

  // Generate DataMatrix code
  const generateDataMatrix = useCallback(() => {
    if (canvasRef.current) {
      try {
        // Get the container width to make it responsive
        const containerWidth = Math.min(window.innerWidth * 0.7, 300) // 70% of screen width, max 300px
        const scale = Math.floor(containerWidth / 40) // Dynamic scale based on container
        
        bwipjs.toCanvas(canvasRef.current, {
          bcid: 'datamatrix',
          text: retailPriceUZS.toString(),
          scale: scale,
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
    <>
      {/* Main Calculator Container */}
      <Card className="shadow-lg">
        <CardContent className="p-6 space-y-6">
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

          {/* Results Section */}
          <div className="pt-6 border-t">
            <div className="bg-primary/10 rounded-lg p-6">
              <button 
                onClick={() => setIsPriceDetailsModalOpen(true)}
                className="w-full text-center cursor-pointer"
              >
                <p className="text-3xl font-bold text-primary">
                  {formatNumber(retailPriceUZS)} so'm
                </p>
              </button>
            </div>
          </div>

          {/* Print Button */}
          <div className="pt-6 border-t">
            <Button 
              variant="default"
              className="w-full h-16 bg-black hover:bg-gray-800"
              onClick={() => setIsModalOpen(true)}
            >
              <Printer className="h-6 w-6 text-white" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* DataMatrix Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-sm w-[90vw] max-w-[350px]" showCloseButton={false}>
          <div className="flex items-center justify-center p-4">
            <canvas 
              ref={canvasRef} 
              className="max-w-full h-auto"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Price Details Modal */}
      <Dialog open={isPriceDetailsModalOpen} onOpenChange={setIsPriceDetailsModalOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <div className="space-y-3 p-4">
            {/* Cost breakdown */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Asl narxi:</span>
              <span className="font-semibold">{formatNumber(originalPrice)} KRW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pochta xarajat:</span>
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
              <span>Yetib borishi:</span>
              <span className="text-primary">{formatNumber(retailPriceUZS)} so'm</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
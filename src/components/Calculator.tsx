import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { QrCode, AlertTriangle, CheckCircle, TrendingUp, Info } from 'lucide-react'
import bwipjs from 'bwip-js'
import { analyzePricing, getPriceEndingBonus } from '@/lib/priceAnalysis'

const DEFAULT_MARGIN = 20
const DEFAULT_SHIPPING_RATE = 15000 // KRW per 1kg

export function Calculator() {
  const [originalPrice, setOriginalPrice] = useState<number>(10000)
  const [weight, setWeight] = useState<number>(100)
  const [shippingRatePerKg, setShippingRatePerKg] = useState<number>(DEFAULT_SHIPPING_RATE)
  const [margin, setMargin] = useState<number>(DEFAULT_MARGIN)
  const [exchangeRate, setExchangeRate] = useState<number>(9.5) // Default KRW to UZS rate (will be updated from API)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPriceDetailsModalOpen, setIsPriceDetailsModalOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Calculate shipping cost (weight in grams / 1000 to get kg * rate per kg)
  const shippingCost = (weight / 1000) * shippingRatePerKg
  
  // Calculate total cost in KRW
  const totalCostKRW = originalPrice + shippingCost
  
  // Calculate margin amount in KRW
  const marginAmountKRW = totalCostKRW * (margin / 100)
  
  // Calculate final price with margin in KRW
  const priceWithMarginKRW = totalCostKRW + marginAmountKRW
  
  // Convert to UZS and round to nearest thousand
  const retailPriceUZS = Math.round((priceWithMarginKRW * exchangeRate) / 1000) * 1000
  
  // Analyze pricing for visual feedback
  const priceAnalysis = analyzePricing(
    margin,
    shippingCost,
    originalPrice,
    retailPriceUZS
  )
  
  const priceEndingBonus = getPriceEndingBonus(retailPriceUZS)

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
        // Fixed reasonable size for DataMatrix
        const scale = 5 // Good size for mobile and desktop
        
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
              <Label htmlFor="original-price" className="text-lg font-medium">Narxi</Label>
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

          {/* Shipping Rate per KG */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="shipping-rate" className="text-lg font-medium">Pochta</Label>
              <span className="text-lg font-semibold text-primary">{formatNumber(shippingRatePerKg)} KRW</span>
            </div>
            <div className="py-2">
              <Slider
                id="shipping-rate"
                value={[shippingRatePerKg]}
                onValueChange={(value) => setShippingRatePerKg(value[0])}
                min={10000}
                max={50000}
                step={1000}
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
            <div className="relative">
              {/* Price Analysis Warnings */}
              {priceAnalysis.warnings.length > 0 && (
                <div className="mb-3 space-y-2">
                  {priceAnalysis.warnings.map((warning, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-3 py-2 rounded-md">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Main Price Box with Dynamic Background */}
              <div className={`${priceAnalysis.bgGradient} rounded-lg p-6 transition-all duration-500 relative overflow-hidden ${
                priceAnalysis.level === 'excellent' ? 'animate-pulse-soft' : ''
              } ${
                priceAnalysis.level === 'warning' || priceAnalysis.level === 'poor' ? 'animate-warning-pulse' : ''
              }`}>
                {/* Shimmer effect for excellent prices */}
                {priceAnalysis.level === 'excellent' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                )}
                
                {/* Score Badge */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm ${
                    priceAnalysis.level === 'excellent' ? 'animate-glow' : ''
                  }`}>
                    {priceAnalysis.score >= 70 ? (
                      <CheckCircle className={`h-4 w-4 ${priceAnalysis.colorClass}`} />
                    ) : priceAnalysis.score >= 50 ? (
                      <TrendingUp className={`h-4 w-4 ${priceAnalysis.colorClass}`} />
                    ) : (
                      <AlertTriangle className={`h-4 w-4 ${priceAnalysis.colorClass}`} />
                    )}
                    <span className={`text-xs font-bold ${priceAnalysis.colorClass}`}>
                      {priceAnalysis.score}/100
                    </span>
                  </div>
                </div>
                
                {/* Price Display */}
                <button 
                  onClick={() => setIsPriceDetailsModalOpen(true)}
                  className="w-full text-center cursor-pointer relative z-10"
                >
                  <p className="text-3xl font-bold text-primary">
                    {formatNumber(retailPriceUZS)} UZS
                  </p>
                  
                  {/* Price Analysis Message */}
                  <p className={`text-sm mt-2 font-medium ${priceAnalysis.colorClass}`}>
                    {priceAnalysis.message}
                  </p>
                  
                  {/* Price Ending Bonus */}
                  {priceEndingBonus && (
                    <p className="text-xs mt-1 text-muted-foreground">
                      {priceEndingBonus}
                    </p>
                  )}
                </button>
              </div>
              
              {/* Score Explanation Tooltip */}
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                <span>Narx raqobatbardoshligi: Foyda va pochta xarajatlari asosida hisoblanadi</span>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* DataMatrix Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-auto max-w-[90vw]" showCloseButton={false}>
          <div className="flex items-center justify-center p-3">
            <canvas 
              ref={canvasRef} 
              className="block"
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
              <span className="text-muted-foreground">Narxi:</span>
              <span className="font-semibold">{formatNumber(originalPrice)} KRW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pochta ({weight}g):</span>
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
              <span className="text-primary">{formatNumber(retailPriceUZS)} UZS</span>
            </div>
            
            {/* Print Button */}
            <div className="pt-4 border-t mt-3">
              <Button 
                variant="default"
                className="w-full h-12 bg-black hover:bg-gray-800"
                onClick={() => {
                  setIsPriceDetailsModalOpen(false)
                  setTimeout(() => setIsModalOpen(true), 200)
                }}
              >
                <QrCode className="h-5 w-5 text-white mr-2" />
                <span>Barkod</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

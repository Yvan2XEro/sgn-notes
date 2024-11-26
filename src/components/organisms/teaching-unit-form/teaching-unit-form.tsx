import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2 } from 'lucide-react'
import React, { useState } from 'react'

type Element = {
  displayName: string
  excelColumn: number
}

type TeachingUnit = {
  code: string
  name: string
  credits: number
  elements: Element[]
}

export function TeachingUnitForm() {
  const [teachingUnit, setTeachingUnit] = useState<TeachingUnit>({
    code: '',
    name: '',
    credits: 0,
    elements: []
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTeachingUnit(prev => ({ ...prev, [name]: name === 'credits' ? Number(value) : value }))
  }

  const handleElementChange = (index: number, field: keyof Element, value: string | number) => {
    const updatedElements = teachingUnit.elements.map((element, i) => {
      if (i === index) {
        return { ...element, [field]: field === 'excelColumn' ? Number(value) : value }
      }
      return element
    })
    setTeachingUnit(prev => ({ ...prev, elements: updatedElements }))
  }

  const addElement = () => {
    setTeachingUnit(prev => ({
      ...prev,
      elements: [...prev.elements, { displayName: '', excelColumn: 0 }]
    }))
  }

  const removeElement = (index: number) => {
    setTeachingUnit(prev => ({
      ...prev,
      elements: prev.elements.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted Teaching Unit:', teachingUnit)
    // Here you would typically send the data to your backend
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Teaching Unit Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              name="code"
              value={teachingUnit.code}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Unité d&apos;enseignement</Label>
            <Input
              id="name"
              name="name"
              value={teachingUnit.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="credits">Nombre de crédits</Label>
            <Input
              id="credits"
              name="credits"
              type="number"
              value={teachingUnit.credits}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Éléments constitutifs</Label>
            {teachingUnit.elements.map((element, index) => (
              <Card key={index} className="p-4 mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-grow">
                    <Label htmlFor={`displayName-${index}`} className="sr-only">Nom de l'élément</Label>
                    <Input
                      id={`displayName-${index}`}
                      value={element.displayName}
                      onChange={(e) => handleElementChange(index, 'displayName', e.target.value)}
                      placeholder="Nom de l'élément"
                      required
                    />
                  </div>
                  <div className="w-24">
                    <Label htmlFor={`excelColumn-${index}`} className="sr-only">Numéro de colonne Excel</Label>
                    <Input
                      id={`excelColumn-${index}`}
                      type="number"
                      value={element.excelColumn}
                      onChange={(e) => handleElementChange(index, 'excelColumn', e.target.value)}
                      placeholder="Col. #"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeElement(index)}
                    className="h-8 w-8"
                  >
                    <span className="sr-only">Remove Element</span>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
            <Button type="button" variant="outline" onClick={addElement} className="w-full mt-2">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Element
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Submit</Button>
        </CardFooter>
      </Card>
    </form>
  )
}


"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const stepperVariants = cva(
  "flex w-full flex-row items-center justify-between gap-x-2",
  {
    variants: {},
    defaultVariants: {},
  }
)

interface StepperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperVariants> {
  activeStep: number
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, children, activeStep, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children)

    return (
      <div
        ref={ref}
        className={cn(stepperVariants(), className)}
        {...props}
      >
        {childrenArray.map((child, index) => {
          return React.cloneElement(child as React.ReactElement, {
            isActive: index === activeStep,
            isCompleted: index < activeStep,
            index,
          })
        })}
      </div>
    )
  }
)
Stepper.displayName = "Stepper"

const stepVariants = cva("flex flex-col items-center gap-y-2", {
  variants: {},
  defaultVariants: {},
})

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean
  isCompleted?: boolean
  index?: number
}

const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1", stepVariants(), className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Step.displayName = "Step"

const stepLabelVariants = cva(
  "flex h-8 w-8 items-center justify-center rounded-full border-2 font-semibold",
  {
    variants: {
      isActive: {
        true: "border-primary bg-primary text-primary-foreground",
        false: "border-border",
      },
      isCompleted: {
        true: "border-primary bg-primary text-primary-foreground",
        false: "",
      },
    },
    defaultVariants: {
      isActive: false,
      isCompleted: false,
    },
  }
)

interface StepLabelProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof stepLabelVariants> {}

const StepLabel = React.forwardRef<HTMLSpanElement, StepLabelProps>(
  ({ className, isActive, isCompleted, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(stepLabelVariants({ isActive, isCompleted }), className)}
        {...props}
      />
    )
  }
)
StepLabel.displayName = "StepLabel"

export { Stepper, Step, StepLabel } 
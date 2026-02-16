import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { TaskStatus } from "@instituteos/database";

/**
 * Smart Signals Engine
 *
 * Scheduled jobs that detect anomalies and trigger alerts:
 * 1. Attendance Anomaly: if attendance < 3-month average by 15%
 * 2. Task Proximity: if deadline < 24h -> alert
 * 3. Overdue Task Detection: mark overdue tasks
 */
@Injectable()
export class SignalEngineService {
  private readonly logger = new Logger(SignalEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Task Proximity Alert
   * Runs every hour - finds tasks with deadlines within 24 hours
   */
  @Cron(CronExpression.EVERY_HOUR)
  async checkTaskProximity() {
    this.logger.log("🔔 Running Task Proximity check...");

    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const urgentTasks = await this.prisma.task.findMany({
      where: {
        status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] },
        deadline: {
          gte: now,
          lte: in24Hours,
        },
      },
      include: {
        assignedTo: {
          select: { firstName: true, lastName: true, email: true },
        },
        institute: { select: { name: true } },
      },
    });

    for (const task of urgentTasks) {
      this.logger.warn(
        `⏰ PROXIMITY ALERT: Task "${task.title}" assigned to ${task.assignedTo.firstName} ${task.assignedTo.lastName} ` +
          `at ${task.institute.name} is due within 24 hours (deadline: ${task.deadline})`,
      );

      // TODO: Send push notification via Firebase/OneSignal
      // TODO: Send email notification
    }

    this.logger.log(
      `✅ Task Proximity check complete. ${urgentTasks.length} alerts generated.`,
    );
  }

  /**
   * Overdue Task Detection
   * Runs every hour - marks tasks as OVERDUE if past deadline
   */
  @Cron(CronExpression.EVERY_HOUR)
  async markOverdueTasks() {
    this.logger.log("🔔 Running Overdue Task detection...");

    const result = await this.prisma.task.updateMany({
      where: {
        status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] },
        deadline: { lt: new Date() },
      },
      data: { status: TaskStatus.OVERDUE },
    });

    this.logger.log(
      `✅ Overdue detection complete. ${result.count} tasks marked as overdue.`,
    );
  }

  /**
   * Attendance Anomaly Detection
   * Runs daily at 6 PM - checks if today's attendance < 3-month average by 15%
   * Note: This is a placeholder until the Attendance module is built
   */
  @Cron("0 18 * * *") // 6 PM daily
  async checkAttendanceAnomalies() {
    this.logger.log("🔔 Running Attendance Anomaly check...");

    // Placeholder: Will be implemented when Attendance module is built
    // Logic:
    // 1. For each institute, get today's attendance count
    // 2. Calculate 3-month daily average
    // 3. If today < average * 0.85 -> trigger alert

    this.logger.log(
      "✅ Attendance anomaly check complete (placeholder - pending Attendance module).",
    );
  }
}

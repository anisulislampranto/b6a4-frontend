"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardService } from "@/services/dashboard.service";
import type {
  AdminDashboardStats,
  CustomerDashboardStats,
  DashboardRange,
  SellerDashboardStats,
} from "@/types/dashboard.type";
import type { AppRole } from "@/lib/session";
import type { OrderStatus } from "@/types/order.type";
import DateRangeFilter from "./components/DateRangeFilter";
import KPIStatCard from "./components/KPIStatCard";
import TrendChartCard from "./components/TrendChartCard";
import DistributionChartCard from "./components/DistributionChartCard";
import FunnelChartCard from "./components/FunnelChartCard";
import ActivityTableCard from "./components/ActivityTableCard";
import DashboardCardSkeleton from "./components/DashboardCardSkeleton";
import { STATUS_COLORS } from "./constants";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

const statusColorByLabel = STATUS_COLORS as Record<string, string>;

const roleTitle: Record<AppRole, string> = {
  CUSTOMER: "Customer Analytics",
  SELLER: "Seller Analytics",
  ADMIN: "Admin Analytics",
};

const roleSubtitle: Record<AppRole, string> = {
  CUSTOMER: "Track your purchasing behavior, spending trends, and review progress.",
  SELLER: "Monitor revenue, inventory health, and order pipeline movement.",
  ADMIN: "See platform-level growth, GMV, quality, and operational signals in one place.",
};

const roleQuickActions: Record<AppRole, { label: string; href: string; variant?: "default" | "outline" }[]> = {
  CUSTOMER: [
    { label: "Browse Shop", href: "/shop", variant: "default" },
    { label: "My Orders", href: "/orders", variant: "outline" },
    { label: "Cart", href: "/cart", variant: "outline" },
  ],
  SELLER: [
    { label: "Add Medicine", href: "/seller/medicines/add", variant: "default" },
    { label: "Inventory", href: "/seller/medicines", variant: "outline" },
    { label: "Seller Orders", href: "/seller/orders", variant: "outline" },
  ],
  ADMIN: [
    { label: "Manage Users", href: "/admin/users", variant: "default" },
    { label: "Manage Orders", href: "/admin/orders", variant: "outline" },
    { label: "Categories", href: "/admin/categories", variant: "outline" },
    { label: "Brands", href: "/admin/brands", variant: "outline" },
  ],
};

const getRole = (role?: string): AppRole => {
  const normalizedRole = role?.toUpperCase();
  if (normalizedRole === "SELLER" || normalizedRole === "ADMIN") {
    return normalizedRole;
  }
  return "CUSTOMER";
};

export default function DashboardClient() {
  const { data: session, isPending } = authClient.useSession();
  const [range, setRange] = useState<DashboardRange>("30d");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<CustomerDashboardStats | null>(null);
  const [sellerData, setSellerData] = useState<SellerDashboardStats | null>(null);
  const [adminData, setAdminData] = useState<AdminDashboardStats | null>(null);

  const role = useMemo(() => getRole(session?.user?.role ?? undefined), [session?.user?.role]);

  useEffect(() => {
    if (!session?.user) return;

    const canRunCustomQuery = range !== "custom" || (startDate && endDate);
    if (!canRunCustomQuery) return;

    let isCancelled = false;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      const query = range === "custom" ? { range, startDate, endDate } : { range };

      try {
        if (role === "CUSTOMER") {
          const res = await dashboardService.getCustomerDashboard(query);
          if (isCancelled) return;

          if (!res.ok || !res.data?.data) {
            setError("Unable to load customer analytics right now.");
            setCustomerData(null);
            return;
          }

          setCustomerData(res.data.data);
          setSellerData(null);
          setAdminData(null);
          return;
        }

        if (role === "SELLER") {
          const res = await dashboardService.getSellerDashboard(query);
          if (isCancelled) return;

          if (!res.ok || !res.data?.data) {
            setError("Unable to load seller analytics right now.");
            setSellerData(null);
            return;
          }

          setSellerData(res.data.data);
          setCustomerData(null);
          setAdminData(null);
          return;
        }

        const res = await dashboardService.getAdminDashboard(query);
        if (isCancelled) return;

        if (!res.ok || !res.data?.data) {
          setError("Unable to load admin analytics right now.");
          setAdminData(null);
          return;
        }

        setAdminData(res.data.data);
        setCustomerData(null);
        setSellerData(null);
      } catch {
        if (!isCancelled) {
          setError("Something went wrong while loading dashboard insights.");
          setCustomerData(null);
          setSellerData(null);
          setAdminData(null);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isCancelled = true;
    };
  }, [session?.user, role, range, startDate, endDate]);

  if (isPending) {
    return (
      <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <DashboardCardSkeleton key={index} />
          ))}
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="mx-auto min-h-[70vh] max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Card className="rounded-3xl border-border/70 bg-card/90">
          <CardContent className="space-y-5 p-8 text-center">
            <h1 className="text-3xl font-bold text-emerald-700">Dashboard</h1>
            <p className="text-muted-foreground">Please sign in to access your analytics dashboard.</p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="outline">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  const renderCustomer = (data: CustomerDashboardStats) => (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KPIStatCard title="Total Orders" value={String(data.summary.totalOrders)} />
        <KPIStatCard title="Total Spent" value={formatCurrency(data.summary.totalSpent)} />
        <KPIStatCard title="Active Orders" value={String(data.summary.activeOrders)} />
        <KPIStatCard title="Delivered" value={String(data.summary.deliveredOrders)} />
        <KPIStatCard title="Cancelled" value={String(data.summary.cancelledOrders)} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <TrendChartCard title="Monthly Spend Trend" data={data.trends.monthlySpend} variant="area" />
        <DistributionChartCard
          title="Review Completion"
          data={[
            { label: "Reviewed", value: data.summary.reviewedCount },
            { label: "Pending", value: Math.max(data.summary.eligibleReviewCount - data.summary.reviewedCount, 0) },
          ]}
          color="#059669"
          variant="donut"
          valueFormatter={(value) => String(value)}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DistributionChartCard title="Most Purchased Categories" data={data.distributions.topCategories} variant="horizontal-bars" />
        <DistributionChartCard title="Most Purchased Brands" data={data.distributions.topBrands} variant="pie" />
      </section>

      <ActivityTableCard
        title="Recent Orders"
        columns={["Order", "Date", "Status", "Amount"]}
        rows={data.recentOrders.map((order) => [
          `#${order.id.slice(0, 8)}`,
          formatDate(order.createdAt),
          order.status,
          formatCurrency(order.totalAmount),
        ])}
      />
    </>
  );

  const renderSeller = (data: SellerDashboardStats) => (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPIStatCard title="Medicines Listed" value={String(data.summary.totalMedicines)} hint={`Active ${data.summary.activeMedicines}`} />
        <KPIStatCard title="Low Stock" value={String(data.summary.lowStockMedicines)} hint="Stock under 10" />
        <KPIStatCard title="Units Sold" value={String(data.summary.totalUnitsSold)} />
        <KPIStatCard title="Gross Revenue" value={formatCurrency(data.summary.grossRevenue)} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <TrendChartCard title="Revenue Trend" data={data.trends.revenueByDay} variant="line" />
        <DistributionChartCard
          title="Orders by Status"
          data={data.distributions.orderStatus}
          variant="donut"
          colorByLabel={statusColorByLabel}
          valueFormatter={(value) => String(value)}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DistributionChartCard
          title="Top Selling Medicines (Units)"
          data={data.distributions.topMedicines.map((item) => ({ label: item.label, value: item.unitsSold }))}
          variant="pie"
        />
        <FunnelChartCard
          title="Delivery Funnel"
          data={data.distributions.funnel}
          colorByLabel={statusColorByLabel}
        />
      </section>

      <ActivityTableCard
        title="Recent Seller Orders"
        columns={["Order", "Customer", "Status", "Amount"]}
        rows={data.recentOrders.map((order) => [
          `#${order.id.slice(0, 8)}`,
          order.customerName,
          order.status,
          formatCurrency(order.totalAmount),
        ])}
      />
    </>
  );

  const renderAdmin = (data: AdminDashboardStats) => (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KPIStatCard title="GMV Delivered" value={formatCurrency(data.summary.gmvDelivered)} />
        <KPIStatCard title="Total Orders" value={String(data.summary.totalOrders)} />
        <KPIStatCard title="Total Users" value={String(data.summary.totalUsers)} />
        <KPIStatCard title="Total Sellers" value={String(data.summary.totalSellers)} hint={`Active ${data.summary.activeSellers}`} />
        <KPIStatCard title="Avg Rating" value={String(data.summary.averageRating)} hint={`${data.summary.reviewVolume} reviews`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <TrendChartCard title="New Users Trend" data={data.trends.newUsersByDay} variant="bars" />
        <DistributionChartCard
          title="Order Status Distribution"
          data={data.distributions.ordersByStatus}
          variant="donut"
          colorByLabel={statusColorByLabel}
          valueFormatter={(value) => String(value)}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DistributionChartCard
          title="Category Performance (Revenue)"
          data={data.distributions.categoryPerformance.map((item) => ({ label: item.label, value: item.revenue }))}
          variant="horizontal-bars"
          valueFormatter={formatCurrency}
        />
        <DistributionChartCard
          title="Brand Performance (Revenue)"
          data={data.distributions.brandPerformance.map((item) => ({ label: item.label, value: item.revenue }))}
          variant="pie"
          valueFormatter={formatCurrency}
        />
      </section>

      <ActivityTableCard
        title="Recent Platform Events"
        columns={["Type", "Timestamp", "Details"]}
        rows={data.recentEvents.map((event) => [event.type, formatDate(event.timestamp), event.message])}
      />
    </>
  );

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-border/70 bg-card/90 px-6 py-7 shadow-[0_24px_40px_-36px_rgba(15,23,42,0.8)] sm:px-8">
        <p className="mb-2 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
          {role}
        </p>
        <h1 className="text-3xl font-bold text-emerald-700 sm:text-4xl">{roleTitle[role]}</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">{roleSubtitle[role]}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {roleQuickActions[role].map((action) => (
            <Button key={action.href} asChild variant={action.variant || "outline"} className="rounded-xl">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <DateRangeFilter
          range={range}
          startDate={startDate}
          endDate={endDate}
          onRangeChange={setRange}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        {range === "custom" && (!startDate || !endDate) ? (
          <p className="text-sm text-amber-600">Select both start and end date to load custom range analytics.</p>
        ) : null}
      </section>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

      {loading ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <DashboardCardSkeleton key={index} />
          ))}
        </section>
      ) : null}

      {!loading && !error && role === "CUSTOMER" && customerData ? renderCustomer(customerData) : null}
      {!loading && !error && role === "SELLER" && sellerData ? renderSeller(sellerData) : null}
      {!loading && !error && role === "ADMIN" && adminData ? renderAdmin(adminData) : null}

      {!loading && !error && !customerData && !sellerData && !adminData ? (
        <Card className="rounded-2xl border-dashed border-border/80 bg-card/80">
          <CardHeader>
            <CardTitle className="text-base">No analytics available yet</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">
            Start activity in your account to populate insights and trends.
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}

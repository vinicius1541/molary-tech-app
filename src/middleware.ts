import {clerkClient, clerkMiddleware, createRouteMatcher} from '@clerk/nextjs/server';
import {NextResponse} from 'next/server';
import { clerkMetadata } from '@/lib/clerk-metadata';

const isPublicRoute = createRouteMatcher(['/'])
const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)'])
const isColaboradorSetupRoute = createRouteMatcher(['/colaborador/criar(.*)'])

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        await auth.protect()
    }

    // Não aplicar verificação para rotas específicas
    if (isPublicRoute(req)
        || isOnboardingRoute(req)
        || isColaboradorSetupRoute(req)
    ) {
        return NextResponse.next();
    }

    // Obter informações do usuário autenticado
    const authState = await auth();
    const { userId } = authState;

    if (!userId) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Verificar se o usuário completou o setup do colaborador
    // usando Clerk Public Metadata ao invés de cookies
    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        if (!clerkMetadata.hasUsuario(user)) {
            return NextResponse.redirect(new URL('/onboarding', req.url));
        }

        if (!clerkMetadata.hasColaborador(user)) {
            // Usuário não tem colaborador configurado, redireciona para criação
            return NextResponse.redirect(new URL('/colaborador/criar', req.url));
        }

        // Usuário tem colaborador, pode prosseguir
        return NextResponse.next();
        
    } catch (error) {
        console.error('Erro ao verificar metadata do colaborador:', error);
        // Em caso de erro, redireciona para criação por segurança
        return NextResponse.redirect(new URL('/colaborador/criar', req.url));
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({ 
    columns, 
    data, 
    onRowClick,
    searchable = true,
    filterable = false,
    paginated = true,
    pageSize = 10
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const filteredData = data.filter(row => {
        if (!searchTerm) return true;
        return Object.values(row).some(value => 
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortColumn) return 0;
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return sortDirection === 'asc' ? comparison : -comparison;
    });

    const totalPages = Math.ceil(sortedData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = paginated 
        ? sortedData.slice(startIndex, startIndex + pageSize)
        : sortedData;

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Search & Filters */}
            {(searchable || filterable) && (
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {searchable && (
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-alpha"
                                />
                            </div>
                        )}
                        {filterable && (
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                                <Filter className="w-4 h-4" />
                                <span>Filtres</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-alpha text-white">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                    className={`px-4 py-3 text-left font-bold uppercase text-xs ${
                                        column.sortable ? 'cursor-pointer hover:bg-alpha/90' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {column.label}
                                        {column.sortable && sortColumn === column.key && (
                                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                                    Aucune donnée disponible
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, index) => (
                                <tr
                                    key={row.id || index}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                        onRowClick ? 'cursor-pointer' : ''
                                    }`}
                                >
                                    {columns.map((column) => (
                                        <td key={column.key} className="px-4 py-3">
                                            {column.render 
                                                ? column.render(row[column.key], row)
                                                : row[column.key]
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {paginated && totalPages > 1 && (
                <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                    <div className="text-sm text-gray-600">
                        Affichage {startIndex + 1} à {Math.min(startIndex + pageSize, sortedData.length)} sur {sortedData.length}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium px-4">
                            Page {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

